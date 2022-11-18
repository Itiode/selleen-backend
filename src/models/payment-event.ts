import mongoose, { Schema } from "mongoose";

import { CustomPaymentEvent } from "../types/payments";

const schema = new Schema<CustomPaymentEvent>(
  {
    id: { type: String, trim: true, unique: true },
    eventType: { type: String, trim: true },
    txRef: { type: String, trim: true },
    flwRef: { type: String, trim: true },
    amount: { type: String, trim: true },
    status: { type: String, trim: true },
    customer: {
      id: { type: String, trim: true },
      fullName: { type: String, trim: true },
      email: { type: String, trim: true },
      createdAt: { type: Date },
      phoneNumber: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

const PaymentEventModel = mongoose.model("Payment-Event", schema);

export default PaymentEventModel;
