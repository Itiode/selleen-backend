"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./start/db"));
const error_1 = __importDefault(require("./middleware/error"));
const user_1 = __importDefault(require("./routes/user"));
const admin_1 = __importDefault(require("./routes/admin/admin"));
const permission_1 = __importDefault(require("./routes/admin/permission"));
const seller_1 = __importDefault(require("./routes/admin/seller"));
const buyer_1 = __importDefault(require("./routes/admin/buyer"));
const shop_1 = __importDefault(require("./routes/admin/shop"));
const product_1 = __importDefault(require("./routes/admin/product"));
const shop_2 = __importDefault(require("./routes/shop/shop"));
const product_2 = __importDefault(require("./routes/shop/product"));
const product_3 = __importDefault(require("./routes/product"));
const order_1 = __importDefault(require("./routes/order"));
const payments_1 = __importDefault(require("./routes/payments"));
const file_1 = __importDefault(require("./routes/file"));
const transaction_1 = __importDefault(require("./routes/transaction"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/users", user_1.default);
app.use("/api/admins", admin_1.default);
app.use("/api/admin/permissions", permission_1.default);
app.use("/api/admin/sellers", seller_1.default);
app.use("/api/admin/buyers", buyer_1.default);
app.use("/api/admin/shops", shop_1.default);
app.use("/api/admin/products", product_1.default);
app.use("/api/shops", shop_2.default);
app.use("/api/shop/products", product_2.default);
app.use("/api/products", product_3.default);
app.use("/api/orders", order_1.default);
app.use("/api/files", file_1.default);
app.use("/api/payments", payments_1.default);
app.use("/api/transactions", transaction_1.default);
app.use(error_1.default);
(0, db_1.default)((db, err) => {
    if (!err) {
        const PORT = process.env.PORT || config_1.default.get("port");
        app.listen(PORT, () => {
            console.log("connected to DB");
            console.log("Listening on port", PORT);
        });
    }
    else {
        console.log("Error in connecting to DB: " + err);
    }
});
