"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = new mongoose_1.Schema({
    name: {
        type: String,
        enum: ["Owner", "Manager", "SupportStaff"],
        required: true,
    },
    shopId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
}, { _id: false });
