import { Schema } from "mongoose";

export default new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true },
    name: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 50,
      required: true,
    },
  },
  { _id: false }
);
