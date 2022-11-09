import { Schema } from "mongoose";

import * as sharedTypes from "../../types/shared";
import { CartProduct } from "../../types/product";

export const NameSchema = new Schema<sharedTypes.Name>(
  {
    first: {
      type: String,
      minlength: 2,
      maxlength: 25,
      trim: true,
      required: true,
    },
    last: {
      type: String,
      minlength: 2,
      maxlength: 25,
      trim: true,
      required: true,
    },
  },
  { _id: false }
);

export const AddressSchema = new Schema<sharedTypes.Address>(
  {
    full: {
      type: String,
      minlength: 2,
      maxlength: 250,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      maxlength: 250,
      trim: true,
    },
    state: {
      type: String,
      minlength: 2,
      maxlength: 250,
      trim: true,
      required: true,
    },
    country: {
      type: String,
      minlength: 2,
      maxlength: 250,
      trim: true,
      required: true,
    },
  },
  { _id: false }
);

export const CartProductSchema = new Schema<CartProduct>(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 25,
      trim: true,
      required: true,
    },
    productId: { type: Schema.Types.ObjectId, required: true },
    price: {
      type: Number,
      min: 100.0,
      max: 1000000.0,
      required: true,
    },
    quantity: { type: Number, min: 1, required: true },
    shopId: { type: Schema.Types.ObjectId, required: true },
  },
  { _id: false }
);

export const CreatorSchema = new Schema<sharedTypes.Creator>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: NameSchema, required: true },
  },
  { _id: false }
);

export const PointSchema = new Schema<sharedTypes.Point>(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

export const SocialMediaLinkSchema = new Schema<sharedTypes.SocialMediaLink>(
  {
    name: {
      type: String,
      enum: ["Facebook", "Instagram", "Twitter"],
      required: true,
    },
    url: { type: String, trim: true, maxlength: 1000, required: true },
  },
  { _id: false }
);

export const PersonalIdSchema = new Schema<sharedTypes.PersonalId>(
  {
    type: {
      type: String,
      enum: ["NationalId", "PVC", "DriverLicense"],
      required: true,
    },
    url: { type: String, trim: true, maxlength: 1000, required: true },
    originalName: { type: String, trim: true, maxlength: 1000, required: true },
  },
  { _id: false }
);
