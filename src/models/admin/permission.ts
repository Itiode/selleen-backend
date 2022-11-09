import mongoose, { Schema } from "mongoose";
import Joi from "joi";

import * as permissionTypes from "../../types/admin/permission";
import * as validators from "../../utils/validators";

const schema = new Schema<permissionTypes.Permission>(
  {
    name: { type: String, trim: true, maxlength: 100, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Permission", schema);

export function validateCreatePermissionData(
  data: permissionTypes.CreatePermissionReqBody
) {
  return Joi.object({
    name: validators.string("Permission name", { max: 100 }),
  }).validate(data);
}

export function validateAddPermissionsData(
  data: permissionTypes.AddPermissionsReqBody
) {
  return Joi.object({
    names: Joi.array().max(100).required().label("Permission names"),
    adminId: validators.mongoId("Admin ID"),
  }).validate(data);
}
