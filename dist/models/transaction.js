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
exports.validateWithdrawalData = exports.DeliveryTransactionModel = exports.ShopTransactionModel = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importStar(require("mongoose"));
const validators = __importStar(require("../utils/validators"));
const schema = new mongoose_1.Schema({
    type: {
        type: String,
        trim: true,
        enum: ["Credit", "Debit"],
        required: true,
    },
    amount: { type: Number, min: 100, max: 1000000, required: true },
    entity: {
        id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
        name: { type: String, trim: true, maxlength: 250, required: true },
    },
    description: { type: String, trim: true, maxlength: 250, required: true },
    beneficiary: {
        id: { type: mongoose_1.Schema.Types.ObjectId },
        name: { type: String, trim: true, maxlength: 250 },
    },
    meta: {
        accountDetails: {
            bankName: { type: String, trim: true },
            accountName: { type: String, trim: true },
            accountNumber: { type: String, trim: true, maxlength: 10 },
            accountType: { type: String, trim: true, enum: ["Savings", "Current"] },
        },
    },
}, { timestamps: true });
exports.ShopTransactionModel = mongoose_1.default.model("Shop-Transaction", schema);
exports.DeliveryTransactionModel = mongoose_1.default.model("Delivery-Transaction", schema);
function validateWithdrawalData(data) {
    return joi_1.default.object({
        shopId: validators.mongoId("Shop ID"),
        amount: joi_1.default.number().min(100).required().label("Amount"),
    }).validate(data);
}
exports.validateWithdrawalData = validateWithdrawalData;
