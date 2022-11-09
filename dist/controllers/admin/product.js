"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveProduct = exports.getProductCount = exports.getProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admin_1 = __importDefault(require("../../models/admin/admin"));
const product_1 = __importDefault(require("../../models/product/product"));
const shared_1 = require("../../models/validators/shared");
const product_2 = require("../../models/validators/admin/product");
const admin_2 = require("../../utils/admin");
const getProducts = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqQuery)(req.query);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const searchText = req.query.searchText;
        const pageNumber = +req.query.pageNumber;
        const pageSize = +req.query.pageSize;
        let prods;
        const slctProps = "name image price numberInStock features description status approved approval variation rating createdAt";
        if (searchText) {
            prods = await product_1.default.find({ $text: { $search: searchText } })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .select(slctProps);
        }
        else {
            prods = await product_1.default.find()
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
const getProductCount = async (req, res, next) => {
    try {
        const totalProds = await product_1.default.find().countDocuments();
        res.send({
            message: "Product count retrieved successfully",
            data: { count: totalProds },
        });
    }
    catch (e) {
        next(new Error("Error in getting product count: " + e));
    }
};
exports.getProductCount = getProductCount;
const approveProduct = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let error;
        error = (0, shared_1.validateSimpleReqParam)(req.params).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        error = (0, product_2.validateApproveProdData)(req.body).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { productId } = req.params;
        const { action, comment } = req.body;
        const fetchedProd = await product_1.default.findById(productId).select("_id");
        if (!fetchedProd)
            return res.status(404).send({ message: "No product with the given ID" });
        const admin = await admin_1.default.findById(req["admin"].id).select("name");
        await product_1.default.updateOne({ _id: productId }, {
            $set: {
                status: action,
                approved: action === "Approved" ? true : false,
                approval: { comment: action === "Approved" ? "Approved" : comment },
            },
        }, { session });
        await (0, admin_2.createAdminAction)({
            entityId: productId,
            initiator: { adminId: admin._id, name: admin.name },
            actionName: action,
            actionCategory: "Product",
            comment,
            session,
        });
        await session.commitTransaction();
        return res.send({
            message: `${action} product successfully`,
        });
    }
    catch (e) {
        await session.abortTransaction();
        next(new Error("Error in approving product: " + e));
    }
    finally {
        session.endSession();
    }
};
exports.approveProduct = approveProduct;
