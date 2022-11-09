import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import * as Jwt from "jsonwebtoken";
import config from "config";

import * as adminTypes from "../../types/admin/admin";
import * as sharedSchemas from "../schemas/shared";
import ImageSchema from "../schemas/image/image";
import * as userTypes from "../../types/user";
import { AuthReqBody } from "../../types/shared";
import * as validators from "../../utils/validators";

const schema = new Schema<userTypes.User>(
  {
    name: { type: sharedSchemas.NameSchema, required: true },
    email: {
      type: String,
      minlength: 5,
      maxlength: 250,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      minlength: 11,
      maxlength: 11,
      required: true,
    },
    permissions: [{ type: String, trim: true, maxlength: 250, required: true }],
    password: { type: String, trim: true, required: true },
    address: { type: sharedSchemas.AddressSchema, required: true },
    image: ImageSchema,
  },
  { timestamps: true }
);

schema.methods.genAuthToken = function () {
  return Jwt.sign(
    {
      id: this._id,
      permissions: this.permissions,
    },
    config.get("jwtAuthPrivateKey"),
    { expiresIn: "12h" }
  );
};

export default mongoose.model("Admin", schema);

export function validateSignupData(data: adminTypes.SignupReqBody) {
  const schema = Joi.object({
    name: Joi.object({
      first: validators.string("First name", { min: 2, max: 25 }),
      last: validators.string("Last name", { min: 2, max: 25 }),
    })
      .required()
      .label("Name"),
    email: validators.email("Email"),
    phone: validators.digit("Phone number", { min: 11, max: 11 }),
    address: Joi.object({
      full: validators.address("Full address"),
      city: validators.address("City"),
      state: validators.address("State"),
      country: validators.address("Country"),
    })
      .required()
      .label("Address"),
    password: validators.string("Password", { min: 6, max: 50 }),
  });

  return schema.validate(data);
}

export function validateLoginData(data: AuthReqBody) {
  return Joi.object({
    email: validators.email(),
    password: validators.string("Password", { min: 6, max: 50 }),
  }).validate(data);
}
