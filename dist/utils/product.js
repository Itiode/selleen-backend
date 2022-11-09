"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForVariations = void 0;
const variation_1 = __importDefault(require("../models/product/variation"));
async function checkForVariations(data) {
    var _a, _b, _c;
    if ((_a = data.variation) === null || _a === void 0 ? void 0 : _a.color) {
        const color = await variation_1.default.findOne({
            type: 'Color',
            shopId: data.shop._id,
            value: data.variation.color,
        });
        if (!color)
            return data.res.status(400).send({
                message: `'${data.variation.color}' isn't included in your product (color) variations`,
            });
    }
    if ((_b = data.variation) === null || _b === void 0 ? void 0 : _b.size) {
        const size = await variation_1.default.findOne({
            type: 'Size',
            shopId: data.shop._id,
            value: data.variation.size,
        });
        if (!size)
            return data.res.status(400).send({
                message: `'${data.variation.size}' isn't included in your product (size) variations`,
            });
    }
    if ((_c = data.variation) === null || _c === void 0 ? void 0 : _c.weight) {
        const weight = await variation_1.default.findOne({
            type: 'Weight',
            shopId: data.shop._id,
            value: data.variation.weight,
        });
        if (!weight)
            return data.res.status(400).send({
                message: `'${data.variation.weight}' isn't included in your product (weight) variations`,
            });
    }
}
exports.checkForVariations = checkForVariations;
