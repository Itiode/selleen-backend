import mongoose, { Schema } from "mongoose";

import { NameSchema } from "../schemas/shared";
import * as adminActionTypes from "../../types/admin/admin-action";

const schema = new Schema<adminActionTypes.AdminAction>(
  {
    initiator: {
      adminId: { type: Schema.Types.ObjectId, required: true },
      name: { type: NameSchema, required: true },
    },
    type: {
      type: String,
      enum: [
        "ApprovedShop",
        "DisapprovedShop",
        "SuspendedShop",
        "ApprovedProduct",
        "DisapprovedProduct",
      ],
      required: true,
    },
    phrase: { type: String, trim: true, maxlength: 100, required: true },
    entityId: { type: String, trim: true, maxlength: 24, required: true },
    comment: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export function getModel(actionCategory: adminActionTypes.AdminActionCategory) {
  if (actionCategory === "Shop")
    return mongoose.model<adminActionTypes.AdminAction>(
      "Admin-Shop-Action",
      schema
    );
  else if (actionCategory === "Product")
    return mongoose.model<adminActionTypes.AdminAction>(
      "Admin-Product-Action",
      schema
    );
  else
    return mongoose.model<adminActionTypes.AdminAction>(
      "Admin-User-Action",
      schema
    );
}
