import { RequestHandler } from "express";

import ProdVModel, * as fromProdV from "../../../models/product/variation";
import * as prodVTypes from "../../../types/shop/product-variation";
import { SimpleResBody } from "../../../types/shared";
import { validateSimpleReqParam } from "../../../models/validators/shared";
import ShopModel from "../../../models/shop";

export const addVariation: RequestHandler<
  any,
  SimpleResBody,
  prodVTypes.AddProdVariationReqBody
> = async (req, res, next) => {
  try {
    const { error } = fromProdV.validateAddProdVariationData(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const fetchedProdVariation = await ProdVModel.findOne({
      ...req.body,
    });
    if (fetchedProdVariation)
      return res.status(400).send({
        message: "A product variation of this type and value exists already.",
      });

    await new ProdVModel({ ...req.body }).save();

    res.status(201).send({ message: "Product variation added successfully." });
  } catch (e) {
    next(new Error("Error in adding product variation: " + e));
  }
};

export const getVariations: RequestHandler<
  { shopId: string },
  prodVTypes.GetProdVariationsResBody
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { shopId } = req.params;

    const shop = await ShopModel.findOne({ _id: shopId }).select("_id");
    if (!shop)
      return res.status(404).send({ message: "No shop with the given ID" });

    const prodVariations = await ProdVModel.find({ shopId }).select("-__v");
    res.send({
      message: "Product variations fetched successfully",
      data: prodVariations,
    });
  } catch (e) {
    next(new Error("Error in getting product variations: " + e));
  }
};

export const deleteVariation: RequestHandler<
  prodVTypes.ProdVariationReqParams,
  SimpleResBody
> = async (req, res, next) => {
  try {
    const { error } = fromProdV.validateProdVariationReqParams(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { shopId, productVariationId } = req.params;

    const shop = await ShopModel.findOne({ _id: shopId }).select("_id");
    if (!shop)
      return res.status(404).send({ message: "No shop with the given ID" });

    const fetchedProdVariation = await ProdVModel.findById(productVariationId);
    if (!fetchedProdVariation)
      return res
        .status(404)
        .send({ message: "No product variation with the given ID" });

    await ProdVModel.deleteOne({
      _id: productVariationId,
    });

    res.send({ message: "Product variation deleted successfully" });
  } catch (e) {
    next(new Error("Error in deleting product variation: " + e));
  }
};
