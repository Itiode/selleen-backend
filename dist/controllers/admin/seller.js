"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerCount = void 0;
const user_1 = __importDefault(require("../../models/user"));
const sellerCount = async (req, res, next) => {
    try {
        const totalSellers = await user_1.default.find({
            shops: { $exists: true, $not: { $size: 0 } },
        }).countDocuments();
        res.send({
            message: "Seller count retrieved successfully",
            data: { count: totalSellers },
        });
    }
    catch (e) {
        next(new Error("Error in getting seller count: " + e));
    }
};
exports.sellerCount = sellerCount;
