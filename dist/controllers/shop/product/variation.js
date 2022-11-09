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
exports.deleteVariation = exports.getVariations = exports.addVariation = void 0;
const variation_1 = __importStar(require("../../../models/product/variation")), fromProdV = variation_1;
const shared_1 = require("../../../models/validators/shared");
const shop_1 = __importDefault(require("../../../models/shop"));
const addVariation = async (req, res, next) => {
    try {
        const { error } = fromProdV.validateAddProdVariationData(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const fetchedProdVariation = await variation_1.default.findOne({
            ...req.body,
        });
        if (fetchedProdVariation)
            return res.status(400).send({
                message: "A product variation of this type and value exists already.",
            });
        await new variation_1.default({ ...req.body }).save();
        res.status(201).send({ message: "Product variation added successfully." });
    }
    catch (e) {
        next(new Error("Error in adding product variation: " + e));
    }
};
exports.addVariation = addVariation;
const getVariations = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { shopId } = req.params;
        const shop = await shop_1.default.findOne({ _id: shopId }).select("_id");
        if (!shop)
            return res.status(404).send({ message: "No shop with the given ID" });
        const prodVariations = await variation_1.default.find({ shopId }).select("-__v");
        res.send({
            message: "Product variations fetched successfully",
            data: prodVariations,
        });
    }
    catch (e) {
        next(new Error("Error in getting product variations: " + e));
    }
};
exports.getVariations = getVariations;
const deleteVariation = async (req, res, next) => {
    try {
        const { error } = fromProdV.validateProdVariationReqParams(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { shopId, productVariationId } = req.params;
        const shop = await shop_1.default.findOne({ _id: shopId }).select("_id");
        if (!shop)
            return res.status(404).send({ message: "No shop with the given ID" });
        const fetchedProdVariation = await variation_1.default.findById(productVariationId);
        if (!fetchedProdVariation)
            return res
                .status(404)
                .send({ message: "No product variation with the given ID" });
        await variation_1.default.deleteOne({
            _id: productVariationId,
        });
        res.send({ message: "Product variation deleted successfully" });
    }
    catch (e) {
        next(new Error("Error in deleting product variation: " + e));
    }
};
exports.deleteVariation = deleteVariation;
