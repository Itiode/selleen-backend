"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shop_1 = __importDefault(require("../models/shop"));
exports.default = async (req, res, next) => {
    try {
        const ownerOrManager = req.user.roles.find((r) => r.name === "Owner" || r.name === "Manager");
        if (!ownerOrManager)
            return res
                .status(403)
                .send({ message: "User is not an owner or manager." });
        const shopId = req.body.shopId;
        const shop = await shop_1.default.findOne({
            $or: [
                {
                    _id: shopId,
                    "owners.userId": req.user.id,
                },
                {
                    _id: shopId,
                    "managers.userId": req.user.id,
                },
            ],
        }).select("owners managers -_id");
        if (!shop)
            return res
                .status(403)
                .send({ message: "User is not an owner or manager for this shop." });
        next();
    }
    catch (err) {
        next(new Error("Error in verifying owner or manager: " + err.message));
    }
};
