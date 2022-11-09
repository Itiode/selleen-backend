import { Schema } from "mongoose";

import { Shop } from "../../../types/shared";

export default new Schema<Shop>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      trim: true,
      required: true,
    },
    id: { type: Schema.Types.ObjectId, required: true },
  },
  { _id: false }
);
