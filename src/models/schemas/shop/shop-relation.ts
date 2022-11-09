import { Schema } from "mongoose";

import { NameSchema } from "../shared";
import { ShopRelation } from "../../../types/shop/shop";

export default new Schema<ShopRelation>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: NameSchema, required: true },
  },
  { _id: false }
);
