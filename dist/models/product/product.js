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
exports.validateDeleteS3ProdImagesReqParams = exports.validateDeleteProdReqParams = exports.validateAddOrEditProdData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const image_1 = __importDefault(require("../schemas/image/image"));
const feature_1 = __importDefault(require("../schemas/product/feature"));
const price_1 = __importDefault(require("../schemas/product/price"));
const variation_1 = __importDefault(require("../schemas/product/variation"));
const shared_1 = require("../schemas/shared");
const validators = __importStar(require("../../utils/validators"));
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 100,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        minLength: 5,
        maxLength: 250,
        trim: true,
        required: true,
    },
    price: {
        type: price_1.default,
        required: true,
    },
    numberInStock: { type: Number, min: 1, required: true },
    tagsString: { type: String, trim: true, maxlength: 500, required: true },
    shop: {
        id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
        name: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 50,
            required: true,
        },
        alias: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 50,
            lowercase: true,
        },
    },
    location: { type: shared_1.PointSchema, required: true },
    tags: { type: [String] },
    status: {
        type: String,
        enum: ["InReview", "Approved", "Disapproved"],
        default: "InReview",
    },
    approved: {
        type: Boolean,
        default: false,
    },
    approval: { comment: { type: String, trim: true, maxlength: 500 } },
    variation: variation_1.default,
    images: [image_1.default],
    rating: { type: Number, min: 1.0, max: 10.0, default: 1.0 },
    features: [feature_1.default],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Product", schema);
function validateAddOrEditProdData(data) {
    const schema = joi_1.default.object({
        name: validators.string("Product name", { min: 2, max: 250 }),
        description: validators.string("Product description", {
            min: 5,
            max: 500,
        }),
        price: joi_1.default.object({
            original: joi_1.default.number().min(100).allow("", null).label("Original price"),
            sales: joi_1.default.number().min(100).required().label("Sales price"),
        }),
        numberInStock: joi_1.default.number().min(1).required().label("Number in stock"),
        shopId: validators.mongoId("Shop ID"),
        images: joi_1.default.array()
            .items(joi_1.default.object({ url: joi_1.default.string().trim().label("Product image url") }))
            .min(1)
            .max(3)
            .required()
            .label("Product image urls"),
        features: joi_1.default.array()
            .items(joi_1.default.object({
            name: validators.string("Feature name", { max: 50 }),
            details: validators.string("Feature details", { max: 250 }),
        }))
            .max(100)
            .label("Features"),
        variation: joi_1.default.object({
            color: joi_1.default.string().trim().min(2).max(50).label("Product color"),
            size: joi_1.default.string().trim().min(2).max(50).label("Product size"),
            weight: joi_1.default.string().trim().min(2).max(50).label("Product weight"),
        }),
    });
    return schema.validate(data);
}
exports.validateAddOrEditProdData = validateAddOrEditProdData;
function validateDeleteProdReqParams(data) {
    return joi_1.default.object({
        shopId: validators.mongoId("Shop ID"),
        productId: validators.mongoId("Product ID"),
    }).validate(data);
}
exports.validateDeleteProdReqParams = validateDeleteProdReqParams;
function validateDeleteS3ProdImagesReqParams(data) {
    return joi_1.default.object({
        shopId: validators.mongoId("Shop ID"),
        productId: validators.mongoId("Product ID"),
    }).validate(data);
}
exports.validateDeleteS3ProdImagesReqParams = validateDeleteS3ProdImagesReqParams;
