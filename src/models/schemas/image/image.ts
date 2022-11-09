import { Schema } from "mongoose";

import { Image } from "../../../types/shared";

export default new Schema<Image>(
  {
    url: { type: String, trim: true },
  },
  { _id: false }
);
