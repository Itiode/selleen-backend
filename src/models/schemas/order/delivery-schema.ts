import { Schema } from "mongoose";

export default new Schema(
  {
    medium: {
      type: String,
      enum: ["Pickup", "Rider", "Driver"],
      required: true,
    },
    agent: {
      name: { type: String, trim: true, maxlength: 250 },
      phone: { type: String, minlength: 11, maxlength: true },
    },
  },
  { _id: false }
);
