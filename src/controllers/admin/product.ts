import { RequestHandler } from "express";
import { ValidationError } from "joi";
import mongoose from "mongoose";

import AdminModel from "../../models/admin/admin";
import ProdModel from "../../models/product/product";
import {
  GetEntityCountResBody,
  SimpleReqParam,
  SimpleReqQuery,
  SimpleResBody,
} from "../../types/shared";
import {
  validateSimpleReqParam,
  validateSimpleReqQuery,
} from "../../models/validators/shared";
import { ApproveProductReqBody } from "../../types/admin/product";
import { validateApproveProdData } from "../../models/validators/admin/product";
import { createAdminAction } from "../../utils/admin";
import { GetShopProductsResBody } from "../../types/shop/product";

export const getProducts: RequestHandler<
  any,
  GetShopProductsResBody,
  any,
  SimpleReqQuery
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqQuery(req.query);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const searchText = req.query.searchText;
    const pageNumber = +req.query.pageNumber;
    const pageSize = +req.query.pageSize;

    let prods: any[];

    const slctProps =
      "name image price numberInStock features description status approved approval variation rating createdAt";

    if (searchText) {
      prods = await ProdModel.find({ $text: { $search: searchText } })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .select(slctProps);
    } else {
      prods = await ProdModel.find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .select(slctProps)
        .sort({ _id: -1 });
    }

    res.send({ message: "Products fetched successfully", data: prods });
  } catch (e) {
    next(new Error("Error in getting products: " + e));
  }
};

export const getProductCount: RequestHandler<
  any,
  GetEntityCountResBody
> = async (req, res, next) => {
  try {
    const totalProds = await ProdModel.find().countDocuments();

    res.send({
      message: "Product count retrieved successfully",
      data: { count: totalProds },
    });
  } catch (e) {
    next(new Error("Error in getting product count: " + e));
  }
};

export const approveProduct: RequestHandler<
  SimpleReqParam,
  SimpleResBody,
  ApproveProductReqBody
> = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let error: ValidationError | undefined;

    error = validateSimpleReqParam(req.params).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    error = validateApproveProdData(req.body).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { productId } = req.params;
    const { action, comment } = req.body;

    const fetchedProd = await ProdModel.findById(productId).select("_id");
    if (!fetchedProd)
      return res.status(404).send({ message: "No product with the given ID" });

    const admin = await AdminModel.findById(req["admin"].id).select("name");

    await ProdModel.updateOne(
      { _id: productId },
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
      entityId: productId,
      initiator: { adminId: admin._id, name: admin.name },
      actionName: action,
      actionCategory: "Product",
      comment,
      session,
    });
    await session.commitTransaction();

    return res.send({
      message: `${action} product successfully`,
    });
  } catch (e) {
    await session.abortTransaction();
    next(new Error("Error in approving product: " + e));
  } finally {
    session.endSession();
  }
};
