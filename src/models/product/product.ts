import mongoose, { Schema } from "mongoose";
import Joi from "joi";

import * as productTypes from "../../types/product";
import imageSchema from "../schemas/image/image";
import productFeatureSchema from "../schemas/product/feature";
import priceSchema from "../schemas/product/price";
import variationSchema from "../schemas/product/variation";
import { PointSchema } from "../schemas/shared";
import * as validators from "../../utils/validators";

const schema = new Schema<productTypes.Product>(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 100,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      minLength: 5,
      maxLength: 250,
      trim: true,
      required: true,
    },
    price: {
      type: priceSchema,
      required: true,
    },
    numberInStock: { type: Number, min: 1, required: true },
    tagsString: { type: String, trim: true, maxlength: 500, required: true },
    shop: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50,
        required: true,
      },
      alias: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50,
        lowercase: true,
      },
    },
    location: { type: PointSchema, required: true },
    tags: { type: [String] },
    status: {
      type: String,
      enum: ["InReview", "Approved", "Disapproved"],
      default: "InReview",
    },
    approved: {
      type: Boolean,
      default: false,
    },
    approval: { comment: { type: String, trim: true, maxlength: 500 } },
    variation: variationSchema,
    images: [imageSchema],
    rating: { type: Number, min: 1.0, max: 10.0, default: 1.0 },
    features: [productFeatureSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Product", schema);

export function validateAddOrEditProdData(
  data: productTypes.AddOrEditProductReqBody
) {
  const schema = Joi.object({
    name: validators.string("Product name", { min: 2, max: 250 }),
    description: validators.string("Product description", {
      min: 5,
      max: 500,
    }),
    price: Joi.object({
      original: Joi.number().min(100).allow("", null).label("Original price"),
      sales: Joi.number().min(100).required().label("Sales price"),
    }),
    numberInStock: Joi.number().min(1).required().label("Number in stock"),
    shopId: validators.mongoId("Shop ID"),
    images: Joi.array()
      .items(
        Joi.object({ url: Joi.string().trim().label("Product image url") })
      )
      .min(1)
      .max(3)
      .required()
      .label("Product image urls"),
    features: Joi.array()
      .items(
        Joi.object({
          name: validators.string("Feature name", { max: 50 }),
          details: validators.string("Feature details", { max: 250 }),
        })
      )
      .max(100)
      .label("Features"),
    variation: Joi.object({
      color: Joi.string().trim().min(2).max(50).label("Product color"),
      size: Joi.string().trim().min(2).max(50).label("Product size"),
      weight: Joi.string().trim().min(2).max(50).label("Product weight"),
    }),
  });

  return schema.validate(data);
}

export function validateDeleteProdReqParams(
  data: productTypes.DeleteProdReqParams
) {
  return Joi.object({
    shopId: validators.mongoId("Shop ID"),
    productId: validators.mongoId("Product ID"),
  }).validate(data);
}

export function validateDeleteS3ProdImagesReqParams(
  data: productTypes.DeleteProdReqParams
) {
  return Joi.object({
    shopId: validators.mongoId("Shop ID"),
    productId: validators.mongoId("Product ID"),
  }).validate(data);
}
