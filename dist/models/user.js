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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhoneNumber = exports.validateAddress = exports.validateChangePwData = exports.validateLoginData = exports.validateSellerSignupData = exports.validateBuyerSignupData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const Jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const sharedSchemas = __importStar(require("./schemas/shared"));
const image_1 = __importDefault(require("./schemas/image/image"));
const shop_1 = __importDefault(require("./schemas/shop/shop"));
const role_1 = __importDefault(require("./schemas/shop/role"));
const order_schema_1 = __importDefault(require("./schemas/order/order-schema"));
const validators = __importStar(require("../utils/validators"));
const schema = new mongoose_1.Schema({
    name: { type: sharedSchemas.NameSchema, required: true },
    password: { type: String, trim: true, required: true },
    email: {
        type: String,
        minlength: 5,
        maxlength: 250,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        unique: true,
        minlength: 11,
        maxlength: 11,
        required: true,
    },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    order: order_schema_1.default,
    image: image_1.default,
    shops: [shop_1.default],
    roles: [role_1.default],
    address: sharedSchemas.AddressSchema,
    knowOf: {
        type: String,
        trim: true,
        enum: [
            "WhatsApp",
            "Facebook",
            "Instagram",
            "Twitter",
            "Selleen Shop Owner",
            "Friend",
        ],
    },
}, { timestamps: true });
schema.methods.genAuthToken = function () {
    return Jwt.sign({
        id: this._id,
        roles: this.roles,
    }, config_1.default.get("jwtAuthPrivateKey"), { expiresIn: "12h" });
};
exports.default = mongoose_1.default.model("User", schema);
function validateBuyerSignupData(data) {
    const schema = joi_1.default.object({
        name: joi_1.default.object({
            first: validators.string("First name", { min: 2, max: 25 }),
            last: validators.string("Last name", { min: 2, max: 25 }),
        }),
        email: validators.email(),
        phone: validators.digit("Phone number", { min: 11, max: 11 }),
        password: validators.string("Password", { min: 6, max: 50 }),
    });
    return schema.validate(data);
}
exports.validateBuyerSignupData = validateBuyerSignupData;
function validateSellerSignupData(data) {
    const schema = joi_1.default.object({
        name: joi_1.default.object({
            first: validators.string("First name", { min: 2, max: 25 }),
            last: validators.string("Last name", { min: 2, max: 25 }),
        }),
        email: validators.email("Personal Email"),
        phone: validators.digit("Phone number", { min: 11, max: 11 }),
        shopName: validators.string("Shop name", { min: 2, max: 50 }),
        shopEmail: validators.email("Shop Email"),
        shopAddress: joi_1.default.object({
            full: validators.address("Full address"),
            city: validators.address("City"),
            state: validators.address("State"),
            country: validators.address("Country"),
        }),
        knowOf: joi_1.default.string()
            .max(250)
            .label("Where did you hear about Selleen")
            .valid("WhatsApp", "Facebook", "Instagram", "Twitter", "Selleen Shop Owner", "Friend"),
        coords: joi_1.default.object({
            lng: joi_1.default.number().required(),
            lat: joi_1.default.number().required(),
        }),
        password: validators.string("Password", { min: 6, max: 50 }),
    });
    return schema.validate(data);
}
exports.validateSellerSignupData = validateSellerSignupData;
function validateLoginData(data) {
    return joi_1.default.object({
        email: validators.email(),
        password: validators.string("Password", { min: 6, max: 50 }),
    }).validate(data);
}
exports.validateLoginData = validateLoginData;
function validateChangePwData(data) {
    return joi_1.default.object({
        oldPassword: validators.string("Old password", { min: 6, max: 50 }),
        newPassword: validators.string("New password", { min: 6, max: 50 }),
    }).validate(data);
}
exports.validateChangePwData = validateChangePwData;
function validateAddress(data) {
    return joi_1.default.object({
        address: joi_1.default.object({
            full: validators.address("Full address"),
            city: validators.address("City"),
            state: validators.address("State"),
            country: validators.address("Country"),
        }),
    }).validate(data);
}
exports.validateAddress = validateAddress;
function validatePhoneNumber(data) {
    return joi_1.default.object({
        phone: joi_1.default.string().trim().length(11).required().label("Phone number"),
    }).validate(data);
}
exports.validatePhoneNumber = validatePhoneNumber;
