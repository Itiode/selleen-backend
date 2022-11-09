"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveShop = exports.getShops = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const shop_1 = __importDefault(require("../../models/shop"));
const admin_1 = __importDefault(require("../../models/admin/admin"));
const shared_1 = require("../../models/validators/shared");
const shop_2 = require("../../models/validators/admin/shop");
const admin_2 = require("../../utils/admin");
const getShops = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqQuery)(req.query);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const pageNumber = +req.query.pageNumber;
        const pageSize = +req.query.pageSize;
        const shops = await shop_1.default.find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .select("-__v -balance -location -tags -updatedAt");
        res.send({ message: "Shops gotten successfully", data: shops });
    }
    catch (e) {
        next(new Error("Error in getting shops: " + e));
    }
};
exports.getShops = getShops;
const approveShop = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let error;
        error = (0, shared_1.validateSimpleReqParam)(req.params).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        error = (0, shop_2.validateApproveShopData)(req.body).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { shopId } = req.params;
        const { action, comment } = req.body;
        const fetchedShop = await shop_1.default.findById(shopId).select("_id");
        if (!fetchedShop)
            return res.status(404).send({ message: "No shop with the given ID" });
        const admin = await admin_1.default.findById(req["admin"].id).select("name");
        await shop_1.default.updateOne({ _id: shopId }, {
            $set: {
                status: action,
                approved: action === "Approved" ? true : false,
                approval: { comment: action === "Approved" ? "Approved" : comment },
            },
        }, { session });
        await (0, admin_2.createAdminAction)({
            entityId: shopId,
            initiator: { adminId: admin._id, name: admin.name },
            actionName: action,
            actionCategory: "Shop",
            comment,
            session,
        });
        await session.commitTransaction();
        return res.send({
            message: `${action} shop successfully`,
        });
    }
    catch (e) {
        await session.abortTransaction();
        next(new Error("Error in approving shop: " + e));
    }
    finally {
        session.endSession();
    }
};
exports.approveShop = approveShop;
