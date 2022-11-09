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
exports.validatePersonalIdData = exports.validateUpdatePaymentDetails = exports.validateShopAlias = exports.validateUpdateSMLinksData = exports.validateUpdateShopData = exports.validateAddShopRelReqBody = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const sharedSchemas = __importStar(require("./schemas/shared"));
const shop_relation_1 = __importDefault(require("./schemas/shop/shop-relation"));
const image_1 = __importDefault(require("./schemas/image/image"));
const validators = __importStar(require("../utils/validators"));
const schema = new mongoose_1.Schema({
    shortId: {
        type: String,
        maxlength: 10,
        trim: true,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50,
        required: true,
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 250,
        required: true,
        unique: true,
    },
    address: { type: sharedSchemas.AddressSchema, required: true },
    contactLines: [String],
    alias: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 250,
    },
    location: { type: sharedSchemas.PointSchema, required: true },
    balance: { type: Number, min: 0.0, max: 1000000.0, default: 0.0 },
    logo: image_1.default,
    banners: [image_1.default],
    creator: sharedSchemas.CreatorSchema,
    owners: [shop_relation_1.default],
    managers: [shop_relation_1.default],
    supportStaff: [shop_relation_1.default],
    tags: [String],
    rating: { type: Number, min: 1.0, max: 10.0, default: 1.0 },
    approved: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["InReview", "Approved", "Suspended", "Disapproved"],
        default: "InReview",
    },
    approval: { comment: { type: String, trim: true, maxlength: 500 } },
    socialMediaLinks: [sharedSchemas.SocialMediaLinkSchema],
    paymentDetails: {
        bankAccountDetails: {
            bankName: {
                type: String,
                trim: true,
                maxlength: 250,
            },
            accountName: {
                type: String,
                trim: true,
                maxlength: 250,
            },
            accountNumber: {
                type: String,
                trim: true,
                minlength: 10,
                maxlength: 10,
            },
            accountType: {
                type: String,
                enum: ["Savings", "Current"],
            },
        },
    },
    personalId: sharedSchemas.PersonalIdSchema,
}, { timestamps: true });
const ShopModel = mongoose_1.default.model("shop", schema);
exports.default = ShopModel;
function validateAddShopRelReqBody(data) {
    return joi_1.default.object({
        phone: validators.digit("Phone number", { min: 11, max: 11 }),
        shopId: validators.mongoId("Shop ID"),
        userId: validators.mongoId("User ID"),
    }).validate(data);
}
exports.validateAddShopRelReqBody = validateAddShopRelReqBody;
function validateUpdateShopData(data) {
    const schema = joi_1.default.object({
        alias: joi_1.default.string()
            .trim()
            .min(2)
            .max(50)
            .invalid("admin", "shop", "selleen")
            .pattern(new RegExp("^[a-z0-9-]*$"))
            .label("Shop alias"),
        contactLines: joi_1.default.array()
            .items(joi_1.default.string().length(11).required().label("Contact line"))
            .min(1)
            .max(2)
            .required()
            .label("Contact lines"),
        address: joi_1.default.object({
            full: validators.address("Full address"),
            city: validators.address("City"),
            state: validators.address("State"),
            country: validators.address("Country"),
        }),
        description: validators.string("Description", { min: 5, max: 250 }),
    });
    return schema.validate(data);
}
exports.validateUpdateShopData = validateUpdateShopData;
function validateUpdateSMLinksData(data) {
    const link = joi_1.default.object().keys({
        name: joi_1.default.string()
            .trim()
            .valid("Facebook", "Instagram", "Twitter")
            .label("Social media name"),
        url: validators.string("Social media link", { max: 1000 }),
    });
    return joi_1.default.object({
        links: joi_1.default.array().items(link).min(1).max(3),
    }).validate(data);
}
exports.validateUpdateSMLinksData = validateUpdateSMLinksData;
function validateShopAlias(data) {
    return joi_1.default.object({
        alias: validators.regexString("Shop alias", "^[a-z0-9-]*$", {
            min: 2,
            max: 50,
        }),
    }).validate(data);
}
exports.validateShopAlias = validateShopAlias;
function validateUpdatePaymentDetails(data) {
    const schema = joi_1.default.object({
        paymentDetails: joi_1.default.object({
            bankAccountDetails: joi_1.default.object({
                bankName: validators.string("Bank name", {
                    max: 250,
                }),
                accountName: validators.string("Account name", {
                    max: 250,
                }),
                accountNumber: validators.digit("Account number", {
                    max: 10,
                }),
                accountType: joi_1.default.string()
                    .label("Account type")
                    .trim()
                    .valid("Savings", "Current")
                    .required(),
            }),
        }),
    });
    return schema.validate(data);
}
exports.validateUpdatePaymentDetails = validateUpdatePaymentDetails;
function validatePersonalIdData(data) {
    return joi_1.default.object({
        type: joi_1.default.string()
            .trim()
            .valid("NationalId", "PVC", "DriverLicense")
            .label("Personal ID"),
        url: validators.string("Personal ID url", { max: 1000 }),
        originalName: validators.string("Original name", { max: 1000 }),
    }).validate(data);
}
exports.validatePersonalIdData = validatePersonalIdData;
