import { RequestHandler } from "express";
import { ValidationError } from "joi";

import ProdReviewModel, * as fromProdReview from "../../models/product/review";
import ProdModel from "../../models/product/product";
import UserModel from "../../models/user";
import { AddProdReviewReqBody } from "../../types/product";
import { SimpleResBody } from "../../types/shared";
import { validateSimpleReqParam } from "../../models/validators/shared";

export const addReview: RequestHandler<
  { productId: string },
  SimpleResBody,
  AddProdReviewReqBody
> = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let error: ValidationError | undefined;

    error = validateSimpleReqParam(req.params).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    error = fromProdReview.validateAddProdReview(req.body).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const userId = req["user"].id;
    const { text } = req.body;

    const fetchedProd = await ProdModel.findById(productId);
    if (!fetchedProd)
      return res.status(404).send({ message: "No product with the given ID" });

    const user = await UserModel.findById(userId).select("name");
    if (!user)
      return res.status(404).send({ message: "No user with the given ID" });

    await new ProdReviewModel({
      creator: { userId: userId, name: user.name },
      text,
      productId,
    }).save();

    res.status(201).send({ message: "Review added successfully" });
  } catch (e) {
    next(new Error("Error in adding product review: " + e));
  }
};
