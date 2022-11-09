"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shop_1 = __importDefault(require("../models/shop"));
exports.default = async (req, res, next) => {
    try {
        const shopRel = req.user.roles.find((r) => r.name === "Owner" || r.name === "Manager" || r.name === "SupportStaff");
        if (!shopRel)
            return res
                .status(403)
                .send({ message: "User is not related to any shop." });
        const shopId = req.params.shopId;
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
                {
                    _id: shopId,
                    "supportStaff.userId": req.user.id,
                },
            ],
        }).select("owners managers supportStaff -_id");
        if (!shop)
            return res
                .status(403)
                .send({ message: "User is not related to this shop." });
        next();
    }
    catch (err) {
        next(new Error("Error in verifying user's relation to shop: " + err.message));
    }
};
