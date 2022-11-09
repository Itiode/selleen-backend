"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrderReqBody = exports.validateOrderStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const user_schema_1 = __importDefault(require("./schemas/order/user-schema"));
const shop_schema_1 = __importDefault(require("./schemas/order/shop-schema"));
const delivery_schema_1 = __importDefault(require("./schemas/order/delivery-schema"));
const product_schema_1 = __importDefault(require("./schemas/order/product-schema"));
const validators = __importStar(require("../utils/validators"));
const schema = new mongoose_1.Schema({
    shortId: {
        type: String,
        maxlength: 10,
        trim: true,
        required: true,
        unique: true,
    },
    shop: { type: shop_schema_1.default, required: true },
    user: { type: user_schema_1.default, required: true },
    delivery: { type: delivery_schema_1.default },
    status: {
        type: String,
        enum: ["Processing", "En Route", "Delivered"],
    },
    products: { type: [product_schema_1.default], required: true },
    note: { type: String, trim: true, maxlength: 500 },
    totalAmount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Order", schema);
function validateOrderStatus(data) {
    return joi_1.default.object({
        status: joi_1.default.string()
            .trim()
            .valid("Processed", "En Route", "Delivered")
            .label("Order status"),
    }).validate(data);
}
exports.validateOrderStatus = validateOrderStatus;
function validateOrderReqBody(data) {
    const product = joi_1.default.object().keys({
        name: validators.string("Product name", { min: 2, max: 250 }),
        productId: validators.mongoId("Product ID"),
        price: validators.number("Price", { min: 100, max: 1000000 }),
        quantity: validators.number("Quantity", { max: 1000000 }),
        shopId: validators.mongoId("Shop ID"),
    });
    const schema = joi_1.default.object({
        name: joi_1.default.object({
            first: validators.string("First name", { min: 2, max: 25 }),
            last: validators.string("Last name", { min: 2, max: 25 }),
        }),
        phone: validators.digit("Phone number", { min: 11, max: 11 }),
        address: joi_1.default.object({
            full: validators.address("Full address"),
            city: validators.address("City"),
            state: validators.address("State"),
            country: validators.address("Country"),
        }),
        products: joi_1.default.array().items(product),
        coords: joi_1.default.object({
            lng: joi_1.default.number().required(),
            lat: joi_1.default.number().required(),
        }),
        delivery: joi_1.default.object({
            medium: joi_1.default.string().trim().valid("Pickup", "Rider", "Driver").required(),
        }),
        note: joi_1.default.string().trim().max(500).allow("").label("Note"),
    });
    return schema.validate(data);
}
exports.validateOrderReqBody = validateOrderReqBody;
