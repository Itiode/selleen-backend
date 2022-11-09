import { Schema } from "mongoose";

import { Price } from "../../../types/product";

export default new Schema<Price>(
  {
    original: {
      type: Number,
      min: 100.0,
    },
    sales: {
      type: Number,
      min: 100.0,
      required: true,
    },
  },
  { _id: false }
);
