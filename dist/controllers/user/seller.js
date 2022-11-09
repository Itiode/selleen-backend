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
exports.signup = exports.getTodos = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nanoid_1 = require("nanoid");
const user_1 = __importStar(require("../../models/user")), fromUser = user_1;
const shop_1 = __importDefault(require("../../models/shop"));
const user_2 = require("../../utils/user");
const getTodos = async (req, res, next) => {
    try {
        const shopId = req.params.shopId;
        const todos = [];
        const shop = await shop_1.default.findById(shopId).select("alias contactLines banners logo socialMediaLinks personalId paymentDetails");
        if (!shop)
            return res.status(404).send({ message: "No shop with the given ID" });
        if (!shop.logo)
            todos.push({
                message: "Add a logo to promote your shop's identity",
            });
        if (!shop.banners || shop.banners.length < 1)
            todos.push({
                message: "Add a banner to beautify your shop.",
            });
        if (!shop.alias)
            todos.push({ message: "Add a shop alias to generate a shop link." });
        if (!shop.contactLines || shop.contactLines.length < 1)
            todos.push({ message: "Add contact lines for your shop." });
        if (!shop.paymentDetails.bankAccountDetails.accountName)
            todos.push({ message: "Add your bank account details" });
        if (!shop.socialMediaLinks || shop.socialMediaLinks.length < 1)
            todos.push({ message: "Add your shops's social media link(s)." });
        if (!shop.personalId)
            todos.push({
                message: "Add a personal ID, so your shop can be approved.",
            });
        res.send({ message: "Todos gotten successfully", data: { todos } });
    }
    catch (e) {
        next(new Error("Error in getting todos: " + e));
    }
};
exports.getTodos = getTodos;
const signup = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { error } = fromUser.validateSellerSignupData(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { name, email, phone, shopName, shopEmail, shopAddress, knowOf, coords, password, } = req.body;
        let fetchedUser = await user_1.default.findOne({
            $or: [{ email }, { phone }],
        }).select("_id");
        if (fetchedUser)
            return res.status(400).send({ message: "User already registered." });
        const fetchedShop = await shop_1.default.findOne({ email: shopEmail });
        if (fetchedShop)
            return res
                .status(400)
                .send({ message: "A shop with this Email exists already." });
        const hashedPw = await bcrypt_1.default.hash(password, 10);
        const newUser = await new user_1.default({
            name,
            email,
            phone,
            password: hashedPw,
            knowOf,
        }).save({ session });
        const shortId = (0, nanoid_1.customAlphabet)("1234567890abcdef", 10)();
        const shop = new shop_1.default({
            shortId,
            name: shopName,
            email: shopEmail,
            address: shopAddress,
            creator: {
                userId: newUser._id,
                name: newUser.name,
            },
            owners: [
                {
                    userId: newUser._id,
                    name: newUser.name,
                },
            ],
            location: { type: "Point", coordinates: [coords.lng, coords.lat] },
        });
        await user_1.default.updateOne({ _id: newUser._id }, {
            $push: {
                roles: {
                    name: "Owner",
                    shopId: shop._id,
                },
                shops: { name: shop.name, id: shop._id },
            },
        }, { session });
        await shop.save({ session });
        await session.commitTransaction();
        const user = await user_1.default.findById(newUser._id).select("roles");
        const token = user.genAuthToken();
        const decodedToken = (0, user_2.decodeUserToken)(token);
        res.status(201).send({
            message: "Seller signed up successfully.",
            data: {
                id: newUser._id,
                token,
                tokenExpirationDate: decodedToken.exp,
            },
        });
    }
    catch (err) {
        await session.abortTransaction();
        next(new Error("Error in signing up seller: " + err));
    }
    finally {
        session.endSession();
    }
};
exports.signup = signup;
