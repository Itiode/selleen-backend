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
exports.deleteProductImages = exports.deleteProduct = exports.getProducts = exports.addOrEditProduct = void 0;
const shared_1 = require("../../../models/validators/shared");
const product_1 = __importStar(require("../../../models/product/product")), fromProd = product_1;
const shop_1 = __importDefault(require("../../../models/shop"));
const product_2 = require("../../../utils/product");
const s3_1 = require("../../../services/s3");
const addOrEditProduct = async (req, res, next) => {
    const { productId } = req.params;
    const editMode = productId;
    try {
        let error;
        if (productId) {
            error = (0, shared_1.validateSimpleReqParam)(req.params).error;
            if (error)
                return res.status(400).send({ message: error.details[0].message });
        }
        error = fromProd.validateAddOrEditProdData(req.body).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { name, description, price, numberInStock, shopId, features, variation, images, } = req.body;
        const tagsString = `${name}`;
        const shop = await shop_1.default.findById(shopId).select("name alias location approved");
        if (!shop)
            return res.status(404).send({ message: "No shop with the given ID." });
        if (!shop.approved)
            return res
                .status(403)
                .send({ message: "Shop hasn't been approved yet." });
        const checkRes = await (0, product_2.checkForVariations)({ variation, shop, res });
        if (checkRes)
            return;
        const prodData = {
            name,
            description,
            price,
            tagsString,
            shop: { id: shop._id, name: shop.name, alias: shop.alias },
            numberInStock,
            images,
            location: shop.location,
            features,
            variation,
        };
        if (editMode) {
            const updatedProd = await product_1.default.findByIdAndUpdate(productId, {
                $set: { ...prodData, status: "InReview", approved: false },
            }, { useFindAndModify: false }).select("_id");
            if (!updatedProd)
                return res
                    .status(404)
                    .send({ message: "No product with the given ID" });
        }
        else {
            await new product_1.default({
                ...prodData,
            }).save();
        }
        res.status(201).send({
            message: `Product ${editMode ? "edited" : "added"} successfully.`,
        });
    }
    catch (e) {
        next(new Error(`Error in ${editMode ? "editing" : "adding"} product: ` + e));
    }
};
exports.addOrEditProduct = addOrEditProduct;
const getProducts = async (req, res, next) => {
    try {
        let error;
        error = (0, shared_1.validateSimpleReqParam)(req.params).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        error = (0, shared_1.validateSimpleReqQuery)(req.query).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { shopId } = req.params;
        const searchText = req.query.searchText;
        const pageNumber = +req.query.pageNumber;
        const pageSize = +req.query.pageSize;
        const shop = await shop_1.default.findById(shopId).select("_id");
        if (!shop)
            return res.status(404).send({ message: "No shop with the given ID" });
        let prods;
        const slctProps = "name images price numberInStock features description status approved approval variation rating createdAt";
        if (searchText) {
            prods = await product_1.default.find({
                $text: { $search: searchText },
                "shop.id": shopId,
            })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .select(slctProps);
        }
        else {
            prods = await product_1.default.find({ "shop.id": shopId })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .select(slctProps)
                .sort({ _id: -1 });
        }
        res.send({ message: "Products fetched successfully", data: prods });
    }
    catch (e) {
        next(new Error("Error in getting products: " + e));
    }
};
exports.getProducts = getProducts;
const deleteProduct = async (req, res, next) => {
    try {
        const { error } = fromProd.validateDeleteProdReqParams(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const prod = await product_1.default.findOneAndDelete({
            _id: req.params.productId,
            "shop.id": req.params.shopId,
        });
        if (!prod) {
            return res.status(404).send({ message: "No product with the given ID" });
        }
        else {
            return res.send({ message: "Product deleted successfully" });
        }
    }
    catch (e) {
        next(new Error("Error in deleting product: " + e));
    }
};
exports.deleteProduct = deleteProduct;
const deleteProductImages = async (req, res, next) => {
    try {
        const { error } = fromProd.validateDeleteS3ProdImagesReqParams(req.params);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const prod = await product_1.default.findOne({
            _id: req.params.productId,
            "shop.id": req.params.shopId,
        }).select("images -_id");
        if (!prod) {
            return res.status(404).send({ message: "No product with the given ID" });
        }
        if (prod.images && prod.images.length > 0) {
            for (const img of prod.images) {
                await (0, s3_1.deleteFileFromS3)(img.url);
            }
            res.send({ message: "Product images deleted successfully" });
        }
        else {
            res.send({ message: "No existing product images" });
        }
    }
    catch (e) {
        next(new Error("Error in deleting images: " + e));
    }
};
exports.deleteProductImages = deleteProductImages;
