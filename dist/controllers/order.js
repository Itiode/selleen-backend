"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getShopOrderCount = exports.getShopOrders = exports.getUserOrder = exports.placeOrder = exports.saveOrder = void 0;
const config_1 = __importDefault(require("config"));
const mongoose_1 = __importDefault(require("mongoose"));
const order_1 = require("../models/order");
const order_2 = __importDefault(require("../models/order"));
const user_1 = __importDefault(require("../models/user"));
const order_3 = require("../utils/order");
const shared_1 = require("../models/validators/shared");
const constants_1 = require("../utils/constants");
const transaction_1 = require("../models/transaction");
const shop_1 = __importDefault(require("../models/shop"));
const saveOrder = async (req, res, next) => {
    const order = req.body;
    const { error } = (0, order_1.validateOrderReqBody)(order);
    try {
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const userId = req["user"].id;
        await user_1.default.updateOne({ _id: userId }, { order });
        res.status(201).send({ message: "Order saved successfully" });
    }
    catch (e) {
        next(new Error("Error in saving order: " + e));
    }
};
exports.saveOrder = saveOrder;
const placeOrder = async (req, res, next) => {
    try {
        const signature = req.headers["x-endpoint-call-hash"];
        if (!signature || signature !== config_1.default.get("internalEndpointSecretHash")) {
            return res.status(401).end();
        }
        const userId = req.params.userId;
        const user = await user_1.default.findById(userId).select("order");
        if (!user) {
            return res.status(404).send({ message: "No user with the given ID" });
        }
        const order = user.order;
        await (0, order_3.sendOrders)({
            cartProducts: order.products,
            user: {
                id: userId,
                name: order.name,
                phone: order.phone,
                address: order.address,
                coords: order.coords,
            },
            delivery: order.delivery,
            note: order.note,
        });
        await user_1.default.updateOne({ _id: userId }, { order: null });
        res.status(200).end();
    }
    catch (e) {
        next(new Error("Error in placing order: " + e));
    }
};
exports.placeOrder = placeOrder;
const getUserOrder = async (req, res, next) => {
    const userId = req["user"].id;
    try {
        const orders = await order_2.default.find({
            "user.id": userId,
        })
            .select("-user.coords -__v -updatedAt")
            .sort({ _id: -1 });
        res.send({ message: "User's orders fetched successfully", data: orders });
    }
    catch (e) {
        next(new Error("Error in getting user's orders: " + e));
    }
};
exports.getUserOrder = getUserOrder;
const getShopOrders = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const shopId = req.params.shopId;
        const orders = await order_2.default.find({
            "shop.id": shopId,
        })
            .select("-user.coords -__v -updatedAt")
            .sort({ _id: -1 });
        res.send({ message: "Shop's orders fetched successfully", data: orders });
    }
    catch (e) {
        next(new Error("Error in getting shop's orders: " + e));
    }
};
exports.getShopOrders = getShopOrders;
const getShopOrderCount = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const shopId = req.params.shopId;
        const orderCount = await order_2.default.find({
            "shop.id": shopId,
        }).countDocuments();
        res.send({
            message: "Shop's order count gotten successfully",
            data: orderCount,
        });
    }
    catch (e) {
        next(new Error("Error in getting shop's order count: " + e));
    }
};
exports.getShopOrderCount = getShopOrderCount;
const updateOrderStatus = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let error;
        error = (0, shared_1.validateSimpleReqParam)(req.params).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        error = (0, order_1.validateOrderStatus)(req.body).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const orderId = req.params.orderId;
        const order = await order_2.default.findOne({ _id: orderId }).select("shortId status shop totalAmount");
        if (!order)
            return res.status(404).send({ message: "No order with the given ID" });
        const currentStatus = order.status;
        const receivedStatus = req.body.status;
        const createShopTransaction = async (data) => {
            const fetchedTrans = await transaction_1.ShopTransactionModel.findOne({
                "entity.id": order.id,
            });
            if (fetchedTrans)
                return "Already Processed";
            const amount = data.amount - (constants_1.selleenCharge.order / 100) * +data.amount;
            await new transaction_1.ShopTransactionModel({
                type: data.type,
                amount,
                entity: {
                    id: data.order.id,
                    name: data.order.name,
                },
                beneficiary: { id: data.shop.id, name: data.shop.name },
                description: "Credit transaction",
            }).save({ session });
        };
        const creditShopBalance = async (shopId, amount) => {
            const modifiedAmt = amount - (constants_1.selleenCharge.order / 100) * +amount;
            await shop_1.default.updateOne({ _id: shopId }, { $inc: { balance: modifiedAmt } }, { session });
        };
        const updateStatus = async (status) => {
            await order_2.default.updateOne({ _id: orderId }, { $set: { status } }, { session });
            await session.commitTransaction();
            res.send({ message: "Order status updated successfully" });
        };
        if (currentStatus === constants_1.orderStatuses.processing &&
            receivedStatus === constants_1.orderStatuses.processed) {
            const transRes = await createShopTransaction({
                type: "Credit",
                amount: order.totalAmount,
                order: { id: order._id, name: order.shortId },
                shop: { id: order.shop.id, name: order.shop.name },
            });
            if (transRes === "Already Processed") {
                return res.status(400).send({ message: "Order already processed" });
            }
            await creditShopBalance(order.shop.id, order.totalAmount);
            await updateStatus(receivedStatus);
        }
        else if (currentStatus === constants_1.orderStatuses.processed &&
            receivedStatus === constants_1.orderStatuses.enRoute) {
            await updateStatus(receivedStatus);
        }
        else if (currentStatus === constants_1.orderStatuses.enRoute &&
            receivedStatus === constants_1.orderStatuses.delivered) {
            await updateStatus(receivedStatus);
        }
        else {
            res.status(400).send({ message: "Incorrect status for order update" });
        }
    }
    catch (e) {
        await session.abortTransaction();
        next(new Error("Error in updating order status: " + e));
    }
    finally {
        session.endSession();
    }
};
exports.updateOrderStatus = updateOrderStatus;
