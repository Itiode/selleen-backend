import Joi from "joi";
import mongoose, { Schema } from "mongoose";

import { InitiateWithdrawalReqBody, Transaction } from "../types/transaction";
import * as validators from "../utils/validators";

const schema = new Schema<Transaction>(
  {
    type: {
      type: String,
      trim: true,
      enum: ["Credit", "Debit"],
      required: true,
    },
    amount: { type: Number, min: 100, max: 1000000, required: true },
    entity: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, trim: true, maxlength: 250, required: true },
    },
    description: { type: String, trim: true, maxlength: 250, required: true },
    beneficiary: {
      id: { type: Schema.Types.ObjectId },
      name: { type: String, trim: true, maxlength: 250 },
    },
    meta: {
      accountDetails: {
        bankName: { type: String, trim: true },
        accountName: { type: String, trim: true },
        accountNumber: { type: String, trim: true, maxlength: 10 },
        accountType: { type: String, trim: true, enum: ["Savings", "Current"] },
      },
    },
  },
  { timestamps: true }
);

export const ShopTransactionModel = mongoose.model("Shop-Transaction", schema);
export const DeliveryTransactionModel = mongoose.model(
  "Delivery-Transaction",
  schema
);

export function validateWithdrawalData(data: InitiateWithdrawalReqBody) {
  return Joi.object({
    shopId: validators.mongoId("Shop ID"),
    amount: Joi.number().min(100).required().label("Amount"),
  }).validate(data);
}
