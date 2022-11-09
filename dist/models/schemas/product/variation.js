"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = new mongoose_1.Schema({
    color: {
        type: String,
        trim: true,
        maxlength: 50,
    },
    size: {
        type: String,
        trim: true,
        maxlength: 50,
    },
    weight: {
        type: String,
        trim: true,
        maxlength: 50,
    },
}, { _id: false });
