import mongoose, { Schema } from "mongoose";
import Joi from "joi";

import * as sharedSchemas from "./schemas/shared";
import shopRelationSchema from "./schemas/shop/shop-relation";
import imageSchema from "./schemas/image/image";
import * as shopTypes from "../types/shop/shop";
import * as validators from "../utils/validators";
import { PersonalId } from "../types/shared";

const schema = new Schema<shopTypes.Shop>(
  {
    shortId: {
      type: String,
      maxlength: 10,
      trim: true,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 250,
      required: true,
      unique: true,
    },
    address: { type: sharedSchemas.AddressSchema, required: true },
    contactLines: [String],
    alias: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 250,
    },
    location: { type: sharedSchemas.PointSchema, required: true },
    balance: { type: Number, min: 0.0, max: 1000000.0, default: 0.0 },
    logo: imageSchema,
    banners: [imageSchema],
    creator: sharedSchemas.CreatorSchema,
    owners: [shopRelationSchema],
    managers: [shopRelationSchema],
    supportStaff: [shopRelationSchema],
    tags: [String],
    rating: { type: Number, min: 1.0, max: 10.0, default: 1.0 },
    approved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["InReview", "Approved", "Suspended", "Disapproved"],
      default: "InReview",
    },
    approval: { comment: { type: String, trim: true, maxlength: 500 } },
    socialMediaLinks: [sharedSchemas.SocialMediaLinkSchema],
    paymentDetails: {
      bankAccountDetails: {
        bankName: {
          type: String,
          trim: true,
          maxlength: 250,
        },
        accountName: {
          type: String,
          trim: true,
          maxlength: 250,
        },
        accountNumber: {
          type: String,
          trim: true,
          minlength: 10,
          maxlength: 10,
        },
        accountType: {
          type: String,
          enum: ["Savings", "Current"],
        },
      },
    },
    personalId: sharedSchemas.PersonalIdSchema,
  },
  { timestamps: true }
);

const ShopModel = mongoose.model("shop", schema);

export default ShopModel;

export function validateAddShopRelReqBody(data: shopTypes.AddShopRelReqBody) {
  return Joi.object({
    phone: validators.digit("Phone number", { min: 11, max: 11 }),
    shopId: validators.mongoId("Shop ID"),
    userId: validators.mongoId("User ID"),
  }).validate(data);
}

export function validateUpdateShopData(data: shopTypes.UpdateShopReqBody) {
  const schema = Joi.object({
    alias: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .invalid("admin", "shop", "selleen")
      .pattern(new RegExp("^[a-z0-9-]*$"))
      .label("Shop alias"),
    contactLines: Joi.array()
      .items(Joi.string().length(11).required().label("Contact line"))
      .min(1)
      .max(2)
      .required()
      .label("Contact lines"),
    address: Joi.object({
      full: validators.address("Full address"),
      city: validators.address("City"),
      state: validators.address("State"),
      country: validators.address("Country"),
    }),
    description: validators.string("Description", { min: 5, max: 250 }),
  });

  return schema.validate(data);
}

export function validateUpdateSMLinksData(
  data: shopTypes.UpdateSMLinksReqBody
) {
  const link = Joi.object().keys({
    name: Joi.string()
      .trim()
      .valid("Facebook", "Instagram", "Twitter")
      .label("Social media name"),
    url: validators.string("Social media link", { max: 1000 }),
  });

  return Joi.object({
    links: Joi.array().items(link).min(1).max(3),
  }).validate(data);
}

export function validateShopAlias(data: shopTypes.GetShopByAliasReqParam) {
  return Joi.object({
    alias: validators.regexString("Shop alias", "^[a-z0-9-]*$", {
      min: 2,
      max: 50,
    }),
  }).validate(data);
}

export function validateUpdatePaymentDetails(
  data: shopTypes.UpdatePaymentDetailsReqBody
) {
  const schema = Joi.object({
    paymentDetails: Joi.object({
      bankAccountDetails: Joi.object({
        bankName: validators.string("Bank name", {
          max: 250,
        }),
        accountName: validators.string("Account name", {
          max: 250,
        }),
        accountNumber: validators.digit("Account number", {
          max: 10,
        }),
        accountType: Joi.string()
          .label("Account type")
          .trim()
          .valid("Savings", "Current")
          .required(),
      }),
    }),
  });

  return schema.validate(data);
}

export function validatePersonalIdData(data: PersonalId) {
  return Joi.object({
    type: Joi.string()
      .trim()
      .valid("NationalId", "PVC", "DriverLicense")
      .label("Personal ID"),
    url: validators.string("Personal ID url", { max: 1000 }),
    originalName: validators.string("Original name", { max: 1000 }),
  }).validate(data);
}
