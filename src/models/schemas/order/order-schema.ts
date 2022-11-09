import { Schema } from "mongoose";

import { SaveOrderReqBody } from "../../../types/order";
import { NameSchema, AddressSchema, CartProductSchema } from "../shared";

export default new Schema<SaveOrderReqBody>(
  {
    name: { type: NameSchema, required: true },
    phone: {
      type: String,
      minlength: 11,
      maxlength: 11,
      required: true,
    },
    address: { type: AddressSchema, required: true },
    coords: {
      lng: { type: Number, required: true },
      lat: { type: Number, required: true },
    },
    products: { type: [CartProductSchema], required: true },
    delivery: {
      medium: {
        type: String,
        enum: ["Pickup", "Rider", "Driver"],
        required: true,
      },
    },
    note: { type: String, trim: true, maxlength: 500 },
  },
  { _id: false }
);
