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
exports.validateLoginData = exports.validateSignupData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const Jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const sharedSchemas = __importStar(require("../schemas/shared"));
const image_1 = __importDefault(require("../schemas/image/image"));
const validators = __importStar(require("../../utils/validators"));
const schema = new mongoose_1.Schema({
    name: { type: sharedSchemas.NameSchema, required: true },
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
    permissions: [{ type: String, trim: true, maxlength: 250, required: true }],
    password: { type: String, trim: true, required: true },
    address: { type: sharedSchemas.AddressSchema, required: true },
    image: image_1.default,
}, { timestamps: true });
schema.methods.genAuthToken = function () {
    return Jwt.sign({
        id: this._id,
        permissions: this.permissions,
    }, config_1.default.get("jwtAuthPrivateKey"), { expiresIn: "12h" });
};
exports.default = mongoose_1.default.model("Admin", schema);
function validateSignupData(data) {
    const schema = joi_1.default.object({
        name: joi_1.default.object({
            first: validators.string("First name", { min: 2, max: 25 }),
            last: validators.string("Last name", { min: 2, max: 25 }),
        })
            .required()
            .label("Name"),
        email: validators.email("Email"),
        phone: validators.digit("Phone number", { min: 11, max: 11 }),
        address: joi_1.default.object({
            full: validators.address("Full address"),
            city: validators.address("City"),
            state: validators.address("State"),
            country: validators.address("Country"),
        })
            .required()
            .label("Address"),
        password: validators.string("Password", { min: 6, max: 50 }),
    });
    return schema.validate(data);
}
exports.validateSignupData = validateSignupData;
function validateLoginData(data) {
    return joi_1.default.object({
        email: validators.email(),
        password: validators.string("Password", { min: 6, max: 50 }),
    }).validate(data);
}
exports.validateLoginData = validateLoginData;
