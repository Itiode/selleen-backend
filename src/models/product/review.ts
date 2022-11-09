import mongoose, { Schema } from "mongoose";
import Joi from "joi";

import { ProductReview, AddProdReviewReqBody } from "../../types/product";
import { NameSchema } from "../schemas/shared";
import * as validators from "../../utils/validators";

const schema = new Schema<ProductReview>(
  {
    creator: {
      userId: { type: Schema.Types.ObjectId, required: true },
      name: { type: NameSchema, required: true },
    },
    text: { type: String, minlength: 5, maxlength: 250, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product-Review", schema);

export function validateAddProdReview(data: AddProdReviewReqBody) {
  return Joi.object({
    text: validators.string("Review text", { max: 500 }),
  }).validate(data);
}
