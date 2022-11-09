"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmin = void 0;
const admin_1 = __importDefault(require("../../models/admin/admin"));
const getAdmin = async (req, res, next) => {
    try {
        const adminId = req["admin"].id;
        const admin = await admin_1.default.findById(adminId).select("name phone email address permissions");
        if (!admin)
            return res.status(404).send({ message: "No admin with the given ID." });
        res.send({ message: "Admin's data fetched successfully.", data: admin });
    }
    catch (err) {
        next(new Error("Error in getting admin's data: " + err));
    }
};
exports.getAdmin = getAdmin;
