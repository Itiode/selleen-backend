"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = new mongoose_1.Schema({
    medium: {
        type: String,
        enum: ["Pickup", "Rider", "Driver"],
        required: true,
    },
    agent: {
        name: { type: String, trim: true, maxlength: 250 },
        phone: { type: String, minlength: 11, maxlength: true },
    },
}, { _id: false });
