"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = new mongoose_1.Schema({
    id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    name: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 50,
        required: true,
    },
}, { _id: false });
