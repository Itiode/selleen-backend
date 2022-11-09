import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import * as Jwt from "jsonwebtoken";
import config from "config";

import * as sharedSchemas from "./schemas/shared";
import ImageSchema from "./schemas/image/image";
import ShopSchema from "./schemas/shop/shop";
import RoleSchema from "./schemas/shop/role";
import OrderSchema from "./schemas/order/order-schema";
import * as userTypes from "../types/user";
import { AuthReqBody } from "../types/shared";
import * as validators from "../utils/validators";

const schema = new Schema<userTypes.User>(
  {
    name: { type: sharedSchemas.NameSchema, required: true },
    password: { type: String, trim: true, required: true },
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
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    order: OrderSchema,
    image: ImageSchema,
    shops: [ShopSchema],
    roles: [RoleSchema],
    address: sharedSchemas.AddressSchema,
    knowOf: {
      type: String,
      trim: true,
      enum: [
        "WhatsApp",
        "Facebook",
        "Instagram",
        "Twitter",
        "Selleen Shop Owner",
        "Friend",
      ],
    },
  },
  { timestamps: true }
);

schema.methods.genAuthToken = function () {
  return Jwt.sign(
    {
      id: this._id,
      roles: this.roles,
    },
    config.get("jwtAuthPrivateKey"),
    { expiresIn: "12h" }
  );
};

export default mongoose.model("User", schema);

export function validateBuyerSignupData(data: userTypes.BuyerSignupReqBody) {
  const schema = Joi.object({
    name: Joi.object({
      first: validators.string("First name", { min: 2, max: 25 }),
      last: validators.string("Last name", { min: 2, max: 25 }),
    }),
    email: validators.email(),
    phone: validators.digit("Phone number", { min: 11, max: 11 }),
    password: validators.string("Password", { min: 6, max: 50 }),
  });

  return schema.validate(data);
}

export function validateSellerSignupData(data: userTypes.SellerSignupReqBody) {
  const schema = Joi.object({
    name: Joi.object({
      first: validators.string("First name", { min: 2, max: 25 }),
      last: validators.string("Last name", { min: 2, max: 25 }),
    }),
    email: validators.email("Personal Email"),
    phone: validators.digit("Phone number", { min: 11, max: 11 }),
    shopName: validators.string("Shop name", { min: 2, max: 50 }),
    shopEmail: validators.email("Shop Email"),
    shopAddress: Joi.object({
      full: validators.address("Full address"),
      city: validators.address("City"),
      state: validators.address("State"),
      country: validators.address("Country"),
    }),
    knowOf: Joi.string()
      .max(250)
      .label("Where did you hear about Selleen")
      .valid(
        "WhatsApp",
        "Facebook",
        "Instagram",
        "Twitter",
        "Selleen Shop Owner",
        "Friend"
      ),
    coords: Joi.object({
      lng: Joi.number().required(),
      lat: Joi.number().required(),
    }),
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

export function validateChangePwData(data: userTypes.ChangePwReqBody) {
  return Joi.object({
    oldPassword: validators.string("Old password", { min: 6, max: 50 }),
    newPassword: validators.string("New password", { min: 6, max: 50 }),
  }).validate(data);
}

export function validateAddress(data: userTypes.UpdateUserAddressReqBody) {
  return Joi.object({
    address: Joi.object({
      full: validators.address("Full address"),
      city: validators.address("City"),
      state: validators.address("State"),
      country: validators.address("Country"),
    }),
  }).validate(data);
}

export function validatePhoneNumber(data: userTypes.UpdateUserPhoneReqBody) {
  return Joi.object({
    phone: Joi.string().trim().length(11).required().label("Phone number"),
  }).validate(data);
}
