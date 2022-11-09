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
exports.validateFileUploadQueryParams = exports.validateSimpleReqParam = exports.validateSimpleReqQuery = void 0;
const joi_1 = __importDefault(require("joi"));
const validators = __importStar(require("../../utils/validators"));
const validateSimpleReqQuery = (data) => {
    return joi_1.default.object({
        pageSize: validators.number("Page size", { min: 10, max: 50 }),
        pageNumber: validators.number("Page size", { min: 1, max: 100 }),
        searchText: joi_1.default.string()
            .trim()
            .max(250)
            .label("Search text")
            .allow("", null),
    }).validate(data);
};
exports.validateSimpleReqQuery = validateSimpleReqQuery;
const validateSimpleReqParam = (data) => {
    const obj = {};
    for (let key in data) {
        obj[`${key}`] = validators.mongoId(key);
    }
    return joi_1.default.object(obj).validate(data);
};
exports.validateSimpleReqParam = validateSimpleReqParam;
const validateFileUploadQueryParams = (data) => {
    return joi_1.default.object({
        fileType: joi_1.default.string()
            .trim()
            .valid("jpeg", "jpg", "png", "pdf")
            .label("File type"),
        folderName: joi_1.default.string()
            .trim()
            .valid("products", "banners", "logos", "kyc-docs"),
    }).validate(data);
};
exports.validateFileUploadQueryParams = validateFileUploadQueryParams;
