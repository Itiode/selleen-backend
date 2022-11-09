"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shared_1 = require("../shared");
exports.default = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    name: { type: shared_1.NameSchema, required: true },
}, { _id: false });
