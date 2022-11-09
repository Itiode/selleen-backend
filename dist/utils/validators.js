"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoId = exports.number = exports.digit = exports.regexString = exports.string = exports.address = exports.email = void 0;
const joi_1 = __importDefault(require("joi"));
function email(label, opts) {
    const validators = joi_1.default.string()
        .trim()
        .min(5)
        .max(250)
        .lowercase()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
        "string.base": `${label || "Email"} should be text`,
        "string.empty": `${label || "Email"} can't be empty`,
        "string.min": `${label || "Email"} must be at least 5 characters`,
        "string.max": `${label || "Email"} can't be more than 250 characters`,
        "string.email": `${label || "Email"} should be valid`,
        "any.required": `${label || "Email"} is required`,
    });
    return validators;
}
exports.email = email;
function address(label, opts = { min: 2, max: 250 }) {
    return joi_1.default.string()
        .trim()
        .min(opts.min ? opts.min : 2)
        .max(opts.max ? opts.max : 250)
        .allow("", null)
        .required()
        .messages({
        "string.base": `${label} should be text`,
        "string.empty": `${label} can't be empty`,
        "string.min": `${label} must be at least ${opts.min ? opts.min : 2} characters`,
        "string.max": `${label} can't be more than ${opts.max ? opts.max : 250} characters`,
        "any.required": `${label} is required`,
    });
}
exports.address = address;
function string(label, opts = { min: 1, max: 10 }) {
    return joi_1.default.string()
        .trim()
        .min(opts.min ? opts.min : 1)
        .max(opts.max ? opts.max : 10)
        .required()
        .messages({
        "string.base": `${label} should be text`,
        "string.empty": `${label} can't be empty`,
        "string.min": `${label} must be at least ${opts.min ? opts.min : 1} characters`,
        "string.max": `${label} can't be more than ${opts.max ? opts.max : 10} characters`,
        "any.required": `${label} is required`,
    });
}
exports.string = string;
function regexString(label, regex, opts = { min: 1, max: 10 }) {
    const validators = joi_1.default.string()
        .trim()
        .min(opts.min ? opts.min : 1)
        .max(opts.max ? opts.max : 10)
        .pattern(new RegExp(regex))
        .required()
        .messages({
        "string.base": `${label} should be text`,
        "string.empty": `${label} can't be empty`,
        "string.min": `${label} shouldn't be less than ${opts.min ? opts.min : 1} characters`,
        "string.max": `${label} shouldn't be more than ${opts.min ? opts.min : 1} characters`,
        "string.pattern.base": `${label} is invalid`,
        "any.required": `${label} is required`,
    });
    return validators;
}
exports.regexString = regexString;
function digit(label, opts = { min: 1, max: 10 }) {
    return joi_1.default.string()
        .trim()
        .min(opts.min ? opts.min : 1)
        .max(opts.max ? opts.max : 10)
        .pattern(new RegExp("^[0-9]*$"))
        .required()
        .messages({
        "string.base": `${label} should be text`,
        "string.empty": `${label} can't be empty`,
        "string.min": `${label} should be ${opts.min ? opts.min : 1} digits`,
        "string.max": `${label} should be ${opts.max ? opts.max : 10} digits`,
        "string.pattern.base": `${label} is invalid`,
        "any.required": `${label} is required`,
    });
}
exports.digit = digit;
function number(label, opts = { min: 1, max: 10 }) {
    return joi_1.default.number()
        .min(opts.min ? opts.min : 1)
        .max(opts.max ? opts.max : 10)
        .required()
        .messages({
        "number.min": `${label} shouldn't be less than ${opts.min ? opts.min : 1}`,
        "number.max": `${label} shouldn't be greater than ${opts.max ? opts.max : 10}`,
        "any.required": `${label} is required`,
    });
}
exports.number = number;
function mongoId(label) {
    return joi_1.default.string()
        .trim()
        .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
        .required()
        .messages({
        "string.base": `${label} should be text`,
        "string.empty": `${label} can't be empty`,
        "string.pattern.base": `${label} is invalid`,
        "any.required": `${label} is required`,
    });
}
exports.mongoId = mongoId;
