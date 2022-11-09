"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SharedSchemas = __importStar(require("../shared"));
exports.default = new mongoose_1.Schema({
    id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    name: { type: SharedSchemas.NameSchema, required: true },
    phone: {
        type: String,
        trim: true,
        minlength: 11,
        maxlength: 11,
        required: true,
    },
    address: { type: SharedSchemas.AddressSchema, required: true },
    coords: {
        lng: {
            type: Number,
            required: true,
        },
        lat: { type: Number, required: true },
    },
}, { _id: false });
