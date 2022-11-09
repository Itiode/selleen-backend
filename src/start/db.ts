import mongoose, { Mongoose } from "mongoose";
import config from "config";

export default (cb: (db: Mongoose | null, err: Error | null) => void) => {
  mongoose
    .connect(config.get("dbUrl"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((res) => {
      cb(res, null);
    })
    .catch((err) => {
      cb(null, err);
    });
};
