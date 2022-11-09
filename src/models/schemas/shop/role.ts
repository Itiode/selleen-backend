import { Schema } from "mongoose";

import { Role } from "../../../types/shared";

export default new Schema<Role>(
  {
    name: {
      type: String,
      enum: ["Owner", "Manager", "SupportStaff"],
      required: true,
    },
    shopId: { type: Schema.Types.ObjectId, required: true },
  },
  { _id: false }
);
