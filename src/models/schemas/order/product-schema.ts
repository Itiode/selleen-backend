import { Schema } from "mongoose";

export default new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      minLength: 2,
      maxLength: 100,
      trim: true,
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    price: { type: Number, required: true },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);
