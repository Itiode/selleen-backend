"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalIdSchema = exports.SocialMediaLinkSchema = exports.PointSchema = exports.CreatorSchema = exports.CartProductSchema = exports.AddressSchema = exports.NameSchema = void 0;
const mongoose_1 = require("mongoose");
exports.NameSchema = new mongoose_1.Schema({
    first: {
        type: String,
        minlength: 2,
        maxlength: 25,
        trim: true,
        required: true,
    },
    last: {
        type: String,
        minlength: 2,
        maxlength: 25,
        trim: true,
        required: true,
    },
}, { _id: false });
exports.AddressSchema = new mongoose_1.Schema({
    full: {
        type: String,
        minlength: 2,
        maxlength: 250,
        trim: true,
        required: true,
    },
    city: {
        type: String,
        maxlength: 250,
        trim: true,
    },
    state: {
        type: String,
        minlength: 2,
        maxlength: 250,
        trim: true,
        required: true,
    },
    country: {
        type: String,
        minlength: 2,
        maxlength: 250,
        trim: true,
        required: true,
    },
}, { _id: false });
exports.CartProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 25,
        trim: true,
        required: true,
    },
    productId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    price: {
        type: Number,
        min: 100.0,
        max: 1000000.0,
        required: true,
    },
    quantity: { type: Number, min: 1, required: true },
    shopId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
}, { _id: false });
exports.CreatorSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    name: { type: exports.NameSchema, required: true },
}, { _id: false });
exports.PointSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
}, { _id: false });
exports.SocialMediaLinkSchema = new mongoose_1.Schema({
    name: {
        type: String,
        enum: ["Facebook", "Instagram", "Twitter"],
        required: true,
    },
    url: { type: String, trim: true, maxlength: 1000, required: true },
}, { _id: false });
exports.PersonalIdSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["NationalId", "PVC", "DriverLicense"],
        required: true,
    },
    url: { type: String, trim: true, maxlength: 1000, required: true },
    originalName: { type: String, trim: true, maxlength: 1000, required: true },
}, { _id: false });
