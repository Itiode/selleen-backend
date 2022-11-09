import { ValidationError } from "joi";
import { RequestHandler } from "express";
import config from "config";
import mongoose from "mongoose";

import { validateOrderReqBody, validateOrderStatus } from "../models/order";
import OrderModel from "../models/order";
import UserModel from "../models/user";
import {
  GetOrderCountResBody,
  GetOrdersResBody,
  OrderStatus,
  SaveOrderReqBody,
} from "../types/order";
import { sendOrders } from "../utils/order";
import { SimpleReqParam, SimpleResBody } from "../types/shared";
import { validateSimpleReqParam } from "../models/validators/shared";
import { orderStatuses, selleenCharge } from "../utils/constants";
import { ShopTransactionModel } from "../models/transaction";
import ShopModel from "../models/shop";

export const saveOrder: RequestHandler<
  any,
  SimpleResBody,
  SaveOrderReqBody
> = async (req, res, next) => {
  const order = req.body;
  const { error } = validateOrderReqBody(order);
  try {
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const userId = req["user"].id;

    await UserModel.updateOne({ _id: userId }, { order });

    res.status(201).send({ message: "Order saved successfully" });
  } catch (e) {
    next(new Error("Error in saving order: " + e));
  }
};

export const placeOrder: RequestHandler<{ userId: string }> = async (
  req,
  res,
  next
) => {
  try {
    const signature = req.headers["x-endpoint-call-hash"];
    if (!signature || signature !== config.get("internalEndpointSecretHash")) {
      return res.status(401).end();
    }

    const userId = req.params.userId;

    const user = await UserModel.findById(userId).select("order");
    if (!user) {
      return res.status(404).send({ message: "No user with the given ID" });
    }

    const order = user.order;

    await sendOrders({
      cartProducts: order.products,
      user: {
        id: userId,
        name: order.name,
        phone: order.phone,
        address: order.address,
        coords: order.coords,
      },
      delivery: order.delivery,
      note: order.note,
    });

    await UserModel.updateOne({ _id: userId }, { order: null });

    res.status(200).end();
  } catch (e) {
    next(new Error("Error in placing order: " + e));
  }
};

export const getUserOrder: RequestHandler<any, GetOrdersResBody> = async (
  req,
  res,
  next
) => {
  const userId = req["user"].id;
  try {
    const orders = await OrderModel.find({
      "user.id": userId,
    })
      .select("-user.coords -__v -updatedAt")
      .sort({ _id: -1 });
    res.send({ message: "User's orders fetched successfully", data: orders });
  } catch (e) {
    next(new Error("Error in getting user's orders: " + e));
  }
};

export const getShopOrders: RequestHandler<
  SimpleReqParam,
  GetOrdersResBody
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const shopId = req.params.shopId;

    const orders = await OrderModel.find({
      "shop.id": shopId,
    })
      .select("-user.coords -__v -updatedAt")
      .sort({ _id: -1 });
    res.send({ message: "Shop's orders fetched successfully", data: orders });
  } catch (e) {
    next(new Error("Error in getting shop's orders: " + e));
  }
};

export const getShopOrderCount: RequestHandler<
  SimpleReqParam,
  GetOrderCountResBody
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const shopId = req.params.shopId;

    const orderCount = await OrderModel.find({
      "shop.id": shopId,
    }).countDocuments();

    res.send({
      message: "Shop's order count gotten successfully",
      data: orderCount,
    });
  } catch (e) {
    next(new Error("Error in getting shop's order count: " + e));
  }
};

export const updateOrderStatus: RequestHandler<
  SimpleReqParam,
  SimpleResBody,
  { status: OrderStatus }
> = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let error: ValidationError | undefined;

    error = validateSimpleReqParam(req.params).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    error = validateOrderStatus(req.body).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const orderId = req.params.orderId;

    const order = await OrderModel.findOne({ _id: orderId }).select(
      "shortId status shop totalAmount"
    );
    if (!order)
      return res.status(404).send({ message: "No order with the given ID" });

    const currentStatus = order.status;
    const receivedStatus = req.body.status;

    const createShopTransaction = async (data: {
      type: "Credit" | "Debit";
      amount: number;
      order: { id: string; name: string };
      shop: { id: string; name: string };
    }) => {
      const fetchedTrans = await ShopTransactionModel.findOne({
        "entity.id": order.id,
      });
      if (fetchedTrans) return "Already Processed";

      const amount = data.amount - (selleenCharge.order / 100) * +data.amount;

      await new ShopTransactionModel({
        type: data.type,
        amount,
        entity: {
          id: data.order.id,
          name: data.order.name,
        },
        beneficiary: { id: data.shop.id, name: data.shop.name },
        description: "Credit transaction",
      }).save({ session });
    };

    const creditShopBalance = async (shopId: string, amount: number) => {
      const modifiedAmt = amount - (selleenCharge.order / 100) * +amount;
      await ShopModel.updateOne(
        { _id: shopId },
        { $inc: { balance: modifiedAmt } },
        { session }
      );
    };

    const updateStatus = async (status: string) => {
      await OrderModel.updateOne(
        { _id: orderId },
        { $set: { status } },
        { session }
      );

      await session.commitTransaction();

      res.send({ message: "Order status updated successfully" });
    };

    if (
      currentStatus === orderStatuses.processing &&
      receivedStatus === orderStatuses.processed
    ) {
      const transRes = await createShopTransaction({
        type: "Credit",
        amount: order.totalAmount,
        order: { id: order._id, name: order.shortId },
        shop: { id: order.shop.id, name: order.shop.name },
      });

      if (transRes === "Already Processed") {
        return res.status(400).send({ message: "Order already processed" });
      }

      await creditShopBalance(order.shop.id, order.totalAmount);

      await updateStatus(receivedStatus);
    } else if (
      currentStatus === orderStatuses.processed &&
      receivedStatus === orderStatuses.enRoute
    ) {
      await updateStatus(receivedStatus);
    } else if (
      currentStatus === orderStatuses.enRoute &&
      receivedStatus === orderStatuses.delivered
    ) {
      await updateStatus(receivedStatus);
    } else {
      res.status(400).send({ message: "Incorrect status for order update" });
    }
  } catch (e) {
    await session.abortTransaction();
    next(new Error("Error in updating order status: " + e));
  } finally {
    session.endSession();
  }
};
