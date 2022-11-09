"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = new mongoose_1.Schema({
    original: {
        type: Number,
        min: 100.0,
    },
    sales: {
        type: Number,
        min: 100.0,
        required: true,
    },
}, { _id: false });
