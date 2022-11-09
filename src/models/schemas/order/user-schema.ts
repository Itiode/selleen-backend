import { Schema } from "mongoose";

import * as SharedSchemas from "../shared";
import { User } from "../../../types/order";

export default new Schema<User>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: { type: SharedSchemas.NameSchema, required: true },
    phone: {
      type: String,
      trim: true,
      minlength: 11,
      maxlength: 11,
      required: true,
    },
    address: { type: SharedSchemas.AddressSchema, required: true },
    coords: {
      lng: {
        type: Number,
        required: true,
      },
      lat: { type: Number, required: true },
    },
  },
  { _id: false }
);
