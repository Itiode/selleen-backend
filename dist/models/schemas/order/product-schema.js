"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = new mongoose_1.Schema({
    id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        minLength: 2,
        maxLength: 100,
        trim: true,
        required: true,
    },
    quantity: {
        type: Number,
        min: 1,
        required: true,
    },
    price: { type: Number, required: true },
    amount: {
        type: Number,
        required: true,
    },
}, { _id: false });
