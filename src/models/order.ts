import mongoose, { Schema } from "mongoose";
import Joi from "joi";

import { Order, SaveOrderReqBody, UpdateStatusReqBody } from "../types/order";
import userSchema from "./schemas/order/user-schema";
import shopSchema from "./schemas/order/shop-schema";
import deliverySchema from "./schemas/order/delivery-schema";
import productSchema from "./schemas/order/product-schema";
import * as validators from "../utils/validators";

const schema = new Schema<Order>(
  {
    shortId: {
      type: String,
      maxlength: 10,
      trim: true,
      required: true,
      unique: true,
    },
    shop: { type: shopSchema, required: true },
    user: { type: userSchema, required: true },
    delivery: { type: deliverySchema },
    status: {
      type: String,
      enum: ["Processing", "En Route", "Delivered"],
    },
    products: { type: [productSchema], required: true },
    note: { type: String, trim: true, maxlength: 500 },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", schema);

export function validateOrderStatus(data: UpdateStatusReqBody) {
  return Joi.object({
    status: Joi.string()
      .trim()
      .valid("Processed", "En Route", "Delivered")
      .label("Order status"),
  }).validate(data);
}

export function validateOrderReqBody(data: SaveOrderReqBody) {
  const product = Joi.object().keys({
    name: validators.string("Product name", { min: 2, max: 250 }),
    productId: validators.mongoId("Product ID"),
    price: validators.number("Price", { min: 100, max: 1000000 }),
    quantity: validators.number("Quantity", { max: 1000000 }),
    shopId: validators.mongoId("Shop ID"),
  });

  const schema = Joi.object({
    name: Joi.object({
      first: validators.string("First name", { min: 2, max: 25 }),
      last: validators.string("Last name", { min: 2, max: 25 }),
    }),
    phone: validators.digit("Phone number", { min: 11, max: 11 }),
    address: Joi.object({
      full: validators.address("Full address"),
      city: validators.address("City"),
      state: validators.address("State"),
      country: validators.address("Country"),
    }),
    products: Joi.array().items(product),
    coords: Joi.object({
      lng: Joi.number().required(),
      lat: Joi.number().required(),
    }),
    delivery: Joi.object({
      medium: Joi.string().trim().valid("Pickup", "Rider", "Driver").required(),
    }),
    note: Joi.string().trim().max(500).allow("").label("Note"),
  });

  return schema.validate(data);
}
