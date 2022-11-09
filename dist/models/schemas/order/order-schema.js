"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shared_1 = require("../shared");
exports.default = new mongoose_1.Schema({
    name: { type: shared_1.NameSchema, required: true },
    phone: {
        type: String,
        minlength: 11,
        maxlength: 11,
        required: true,
    },
    address: { type: shared_1.AddressSchema, required: true },
    coords: {
        lng: { type: Number, required: true },
        lat: { type: Number, required: true },
    },
    products: { type: [shared_1.CartProductSchema], required: true },
    delivery: {
        medium: {
            type: String,
            enum: ["Pickup", "Rider", "Driver"],
            required: true,
        },
    },
    note: { type: String, trim: true, maxlength: 500 },
}, { _id: false });
