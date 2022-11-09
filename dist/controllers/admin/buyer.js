"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerCount = void 0;
const user_1 = __importDefault(require("../../models/user"));
const buyerCount = async (req, res, next) => {
    try {
        const totalBuyers = await user_1.default.find({
            shops: { $exists: true, $size: 0 },
        }).countDocuments();
        res.send({
            message: "Buyer count retrieved successfully",
            data: { count: totalBuyers },
        });
    }
    catch (e) {
        next(new Error("Error in getting buyer count: " + e));
    }
};
exports.buyerCount = buyerCount;
