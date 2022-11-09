"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShopTransactions = exports.getShopTotalRevenue = exports.getShopTotalWithdrawal = exports.getShopBalance = exports.initiateWithdrawal = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const shared_1 = require("../models/validators/shared");
const transaction_1 = require("../models/transaction");
const shop_1 = __importDefault(require("../models/shop"));
const transaction_2 = require("../models/transaction");
const payments_1 = require("../services/payments");
const initiateWithdrawal = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { error } = (0, transaction_2.validateWithdrawalData)(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { amount, shopId } = req.body;
        const shop = await shop_1.default.findById(shopId).select("name balance paymentDetails");
        if (!shop)
            return res.status(404).send({ message: "No shop with the given ID" });
        if (shop.balance < amount) {
            return res.status(400).send({ message: "Insufficient funds!" });
        }
        const transRes = await (0, payments_1.initiateTransfer)({
            amount,
            bankName: shop.paymentDetails.bankAccountDetails.bankName,
            accountNumber: shop.paymentDetails.bankAccountDetails.accountNumber,
        });
        if (transRes.status === "error") {
            return res
                .status(500)
                .send({ message: "Something failed. Please try again." });
        }
        await shop_1.default.updateOne({ _id: shopId }, { $inc: { balance: -amount } }, { session });
        await new transaction_1.ShopTransactionModel({
            type: "Debit",
            amount,
            entity: {
                id: shop._id,
                name: shop.name,
            },
            description: "Debit transaction",
        }).save({ session });
        await session.commitTransaction();
        res.send({ message: "Withdrawal initiated successfully" });
    }
    catch (e) {
        await session.abortTransaction();
        next(new Error("Error in initiating withdrawal: " + e));
    }
    finally {
        session.endSession();
    }
};
exports.initiateWithdrawal = initiateWithdrawal;
const getShopBalance = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const shopId = req.params.shopId;
        const shop = await shop_1.default.findById(shopId).select("balance");
        res.send({
            message: "Shop's balance gotten successfully",
            data: shop.balance,
        });
    }
    catch (e) {
        next(new Error("Error in getting shop's balance: " + e));
    }
};
exports.getShopBalance = getShopBalance;
const getShopTotalWithdrawal = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const shopId = req.params.shopId;
        const transactions = await transaction_1.ShopTransactionModel.find({
            "entity.id": shopId,
        }).select("amount -_id");
        const total = transactions
            .map((trans) => trans.amount)
            .reduce((a, b) => a + b, 0);
        res.send({
            message: "Shop's total withdrawal gotten successfully",
            data: total,
        });
    }
    catch (e) {
        next(new Error("Error in getting shop's total withdrawal: " + e));
    }
};
exports.getShopTotalWithdrawal = getShopTotalWithdrawal;
const getShopTotalRevenue = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const shopId = req.params.shopId;
        const transactions = await transaction_1.ShopTransactionModel.find({
            "beneficiary.id": shopId,
        }).select("amount -_id");
        const total = transactions
            .map((trans) => trans.amount)
            .reduce((a, b) => a + b, 0);
        res.send({
            message: "Shop's total revenue gotten successfully",
            data: total,
        });
    }
    catch (e) {
        next(new Error("Error in getting shop's total revenue: " + e));
    }
};
exports.getShopTotalRevenue = getShopTotalRevenue;
const getShopTransactions = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const shopId = req.params.shopId;
        const transactions = await transaction_1.ShopTransactionModel.find({
            $or: [{ "entity.id": shopId }, { "beneficiary.id": shopId }],
        })
            .select("-updatedAt -__v")
            .sort({ _id: -1 });
        res.send({
            message: "Shop's transactions fetched successfully",
            data: transactions,
        });
    }
    catch (e) {
        next(new Error("Error in fetching shop's transactions: " + e));
    }
};
exports.getShopTransactions = getShopTransactions;
