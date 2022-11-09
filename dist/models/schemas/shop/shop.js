"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = new mongoose_1.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 50,
        trim: true,
        required: true,
    },
    id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
}, { _id: false });
