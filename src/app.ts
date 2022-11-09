import express from "express";
import { Mongoose } from "mongoose";
import config from "config";
import cors from "cors";

import connectToDB from "./start/db";
import error from "./middleware/error";

import userRoutes from "./routes/user";

import adminRoutes from "./routes/admin/admin";
import adminPermissnRoutes from "./routes/admin/permission";
import adminSellerRoutes from "./routes/admin/seller";
import adminBuyerRoutes from "./routes/admin/buyer";
import adminShopRoutes from "./routes/admin/shop";
import adminProdRoutes from "./routes/admin/product";

import shopRoutes from "./routes/shop/shop";
import shopProdRoutes from "./routes/shop/product";
import prodRoutes from "./routes/product";
import orderRoutes from "./routes/order";

import paymentRoutes from "./routes/payments";
import fileRoutes from "./routes/file";

import transRoutes from "./routes/transaction";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/admins", adminRoutes);
app.use("/api/admin/permissions", adminPermissnRoutes);
app.use("/api/admin/sellers", adminSellerRoutes);
app.use("/api/admin/buyers", adminBuyerRoutes);
app.use("/api/admin/shops", adminShopRoutes);
app.use("/api/admin/products", adminProdRoutes);

app.use("/api/shops", shopRoutes);
app.use("/api/shop/products", shopProdRoutes);
app.use("/api/products", prodRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/files", fileRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/transactions", transRoutes);

app.use(error);

connectToDB((db: Mongoose | null, err: Error | null) => {
  if (!err) {
    const PORT: any = process.env.PORT || config.get("port");
    app.listen(PORT, () => {
      console.log("connected to DB");
      console.log("Listening on port", PORT);
    });
  } else {
    console.log("Error in connecting to DB: " + err);
  }
});
