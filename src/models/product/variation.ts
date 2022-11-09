import mongoose, { Schema } from "mongoose";
import Joi from "joi";

import * as prodVariationTypes from "../../types/shop/product-variation";
import * as validators from "../../utils/validators";

const schema = new Schema<prodVariationTypes.ProductVariation>({
  type: {
    type: String,
    enum: ["Color", "Size", "Weight"],
    required: true,
  },
  value: {
    type: String,
    trim: true,
    maxlength: 50,
    required: true,
  },
  shopId: {
    type: Schema.Types.ObjectId,
    trim: true,
    maxlength: 24,
    required: true,
  },
});

export default mongoose.model("Product-Variation", schema);

export function validateAddProdVariationData(
  data: prodVariationTypes.AddProdVariationReqBody
) {
  return Joi.object({
    type: Joi.string()
      .valid("Size", "Weight", "Color")
      .required()
      .label("Variation type"),
    value: validators.string("Variation value", { max: 50 }),
    shopId: validators.mongoId("Shop ID"),
  }).validate(data);
}

export function validateProdVariationReqParams(
  data: prodVariationTypes.ProdVariationReqParams
) {
  return Joi.object({
    productVariationId: validators.mongoId("Product variation ID"),
    shopId: validators.mongoId("Shop ID"),
  }).validate(data);
}
