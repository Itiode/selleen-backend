import { Schema } from "mongoose";

import { ProductVariation } from "../../../types/product";

export default new Schema<ProductVariation>(
  {
    color: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    size: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    weight: {
      type: String,
      trim: true,
      maxlength: 50,
    },
  },
  { _id: false }
);
