import { RequestHandler } from "express";
import mongoose from "mongoose";

import { validateSimpleReqParam } from "../models/validators/shared";
import { SimpleReqParam, SimpleResBody } from "../types/shared";
import {
  GetBalanceResBody,
  GetTransactionsResBody,
  InitiateWithdrawalReqBody,
} from "../types/transaction";
import { ShopTransactionModel } from "../models/transaction";
import ShopModel from "../models/shop";
import { validateWithdrawalData } from "../models/transaction";
import { initiateTransfer } from "../services/payments";

export const initiateWithdrawal: RequestHandler<
  any,
  SimpleResBody,
  InitiateWithdrawalReqBody
> = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { error } = validateWithdrawalData(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { amount, shopId } = req.body;

    const shop = await ShopModel.findById(shopId).select(
      "name balance paymentDetails"
    );
    if (!shop)
      return res.status(404).send({ message: "No shop with the given ID" });

    if (shop.balance < amount) {
      return res.status(400).send({ message: "Insufficient funds!" });
    }

    const transRes = await initiateTransfer({
      amount,
      bankName: shop.paymentDetails.bankAccountDetails.bankName,
      accountNumber: shop.paymentDetails.bankAccountDetails.accountNumber,
    });

    if (transRes.status === "error") {
      return res
        .status(500)
        .send({ message: "Something failed. Please try again." });
    }

    await ShopModel.updateOne(
      { _id: shopId },
      { $inc: { balance: -amount } },
      { session }
    );

    await new ShopTransactionModel({
      type: "Debit",
      amount,
      entity: {
        id: shop._id,
        name: shop.name,
      },
      description: "Debit transaction",
    }).save({ session });

    await session.commitTransaction();

    res.send({ message: "Withdrawal initiated successfully" });
  } catch (e) {
    await session.abortTransaction();
    next(new Error("Error in initiating withdrawal: " + e));
  } finally {
    session.endSession();
  }
};

export const getShopBalance: RequestHandler<
  SimpleReqParam,
  GetBalanceResBody
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const shopId = req.params.shopId;
    const shop = await ShopModel.findById(shopId).select("balance");

    res.send({
      message: "Shop's balance gotten successfully",
      data: shop.balance,
    });
  } catch (e) {
    next(new Error("Error in getting shop's balance: " + e));
  }
};

export const getShopTotalWithdrawal: RequestHandler<
  SimpleReqParam,
  GetBalanceResBody
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const shopId = req.params.shopId;
    const transactions: { amount: number }[] = await ShopTransactionModel.find({
      "entity.id": shopId,
    }).select("amount -_id");

    const total = transactions
      .map((trans) => trans.amount)
      .reduce((a, b) => a + b, 0);

    res.send({
      message: "Shop's total withdrawal gotten successfully",
      data: total,
    });
  } catch (e) {
    next(new Error("Error in getting shop's total withdrawal: " + e));
  }
};

export const getShopTotalRevenue: RequestHandler<
  SimpleReqParam,
  GetBalanceResBody
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const shopId = req.params.shopId;
    const transactions: { amount: number }[] = await ShopTransactionModel.find({
      "beneficiary.id": shopId,
    }).select("amount -_id");

    const total = transactions
      .map((trans) => trans.amount)
      .reduce((a, b) => a + b, 0);

    res.send({
      message: "Shop's total revenue gotten successfully",
      data: total,
    });
  } catch (e) {
    next(new Error("Error in getting shop's total revenue: " + e));
  }
};

export const getShopTransactions: RequestHandler<
  SimpleReqParam,
  GetTransactionsResBody
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const shopId = req.params.shopId;

    const transactions = await ShopTransactionModel.find({
      $or: [{ "entity.id": shopId }, { "beneficiary.id": shopId }],
    })
      .select("-updatedAt -__v")
      .sort({ _id: -1 });

    res.send({
      message: "Shop's transactions fetched successfully",
      data: transactions,
    });
  } catch (e) {
    next(new Error("Error in fetching shop's transactions: " + e));
  }
};
