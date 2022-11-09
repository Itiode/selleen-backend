"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: 250,
    },
    details: {
        type: String,
        trim: true,
        maxlength: 500,
    },
}, { _id: false });
