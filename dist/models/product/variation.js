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
exports.validateProdVariationReqParams = exports.validateAddProdVariationData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const validators = __importStar(require("../../utils/validators"));
const schema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["Color", "Size", "Weight"],
        required: true,
    },
    value: {
        type: String,
        trim: true,
        maxlength: 50,
        required: true,
    },
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
        trim: true,
        maxlength: 24,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Product-Variation", schema);
function validateAddProdVariationData(data) {
    return joi_1.default.object({
        type: joi_1.default.string()
            .valid("Size", "Weight", "Color")
            .required()
            .label("Variation type"),
        value: validators.string("Variation value", { max: 50 }),
        shopId: validators.mongoId("Shop ID"),
    }).validate(data);
}
exports.validateAddProdVariationData = validateAddProdVariationData;
function validateProdVariationReqParams(data) {
    return joi_1.default.object({
        productVariationId: validators.mongoId("Product variation ID"),
        shopId: validators.mongoId("Shop ID"),
    }).validate(data);
}
exports.validateProdVariationReqParams = validateProdVariationReqParams;
