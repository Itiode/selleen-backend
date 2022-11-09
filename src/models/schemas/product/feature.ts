import { Schema } from "mongoose";

import { ProductFeature } from "../../../types/product";

export default new Schema<ProductFeature>(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 250,
    },
    details: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);
