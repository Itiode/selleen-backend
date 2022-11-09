"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (req, res, next) => {
    try {
        const shopId = req.body.shopId || req.params.shopId;
        if (!shopId) {
            return res
                .status(401)
                .send({ message: "Shop ID is required for validating owner." });
        }
        let isOwner;
        if (req.user.roles) {
            isOwner = req.user.roles.find((r) => r.name === "Owner" && r.shopId === shopId);
        }
        if (!isOwner)
            return res
                .status(403)
                .send({ message: "User is not an owner for this shop." });
        next();
    }
    catch (err) {
        next(new Error("Error in verifying owner: " + err.message));
    }
};
