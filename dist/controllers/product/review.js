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
exports.addReview = void 0;
const review_1 = __importStar(require("../../models/product/review")), fromProdReview = review_1;
const product_1 = __importDefault(require("../../models/product/product"));
const user_1 = __importDefault(require("../../models/user"));
const shared_1 = require("../../models/validators/shared");
const addReview = async (req, res, next) => {
    try {
        const { productId } = req.params;
        let error;
        error = (0, shared_1.validateSimpleReqParam)(req.params).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        error = fromProdReview.validateAddProdReview(req.body).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const userId = req["user"].id;
        const { text } = req.body;
        const fetchedProd = await product_1.default.findById(productId);
        if (!fetchedProd)
            return res.status(404).send({ message: "No product with the given ID" });
        const user = await user_1.default.findById(userId).select("name");
        if (!user)
            return res.status(404).send({ message: "No user with the given ID" });
        await new review_1.default({
            creator: { userId: userId, name: user.name },
            text,
            productId,
        }).save();
        res.status(201).send({ message: "Review added successfully" });
    }
    catch (e) {
        next(new Error("Error in adding product review: " + e));
    }
};
exports.addReview = addReview;
