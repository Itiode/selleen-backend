import { RequestHandler } from "express";
import mongoose from "mongoose";
import { ValidationError } from "joi";

import * as adminShopTypes from "../../types/admin/shop";
import ShopModel from "../../models/shop";
import AdminModel from "../../models/admin/admin";
import {
  validateSimpleReqParam,
  validateSimpleReqQuery,
} from "../../models/validators/shared";
import { validateApproveShopData } from "../../models/validators/admin/shop";
import {
  SimpleReqParam,
  SimpleReqQuery,
  SimpleResBody,
} from "../../types/shared";
import { createAdminAction } from "../../utils/admin";

export const getShops: RequestHandler<
  any,
  adminShopTypes.GetShopsResBody,
  any,
  SimpleReqQuery
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqQuery(req.query);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const pageNumber = +req.query.pageNumber;
    const pageSize = +req.query.pageSize;

    const shops = await ShopModel.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select("-__v -balance -location -tags -updatedAt")

    res.send({ message: "Shops gotten successfully", data: shops });
  } catch (e) {
    next(new Error("Error in getting shops: " + e));
  }
};

export const approveShop: RequestHandler<
  SimpleReqParam,
  SimpleResBody,
  adminShopTypes.ApproveShopReqBody
> = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let error: ValidationError | undefined;

    error = validateSimpleReqParam(req.params).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    error = validateApproveShopData(req.body).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { shopId } = req.params;
    const { action, comment } = req.body;

    const fetchedShop = await ShopModel.findById(shopId).select("_id");
    if (!fetchedShop)
      return res.status(404).send({ message: "No shop with the given ID" });

    const admin = await AdminModel.findById(req["admin"].id).select("name");

    await ShopModel.updateOne(
      { _id: shopId },
      {
        $set: {
          status: action,
          approved: action === "Approved" ? true : false,
          approval: { comment: action === "Approved" ? "Approved" : comment },
        },
      },
      { session }
    );

    await createAdminAction({
      entityId: shopId,
      initiator: { adminId: admin._id, name: admin.name },
      actionName: action,
      actionCategory: "Shop",
      comment,
      session,
    });
    await session.commitTransaction();

    return res.send({
      message: `${action} shop successfully`,
    });
  } catch (e) {
    await session.abortTransaction();
    next(new Error("Error in approving shop: " + e));
  } finally {
    session.endSession();
  }
};
