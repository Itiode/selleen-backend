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
exports.changePassword = exports.updatePhone = exports.updateAddress = exports.getUser = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importStar(require("../../models/user")), fromUser = user_1;
const user_2 = require("../../utils/user");
const login = async (req, res, next) => {
    const { error } = fromUser.validateLoginData(req.body);
    if (error)
        return res.status(400).send({ message: error.details[0].message });
    try {
        const user = await user_1.default.findOne({ email: req.body.email }).select("password roles");
        if (!user)
            return res.status(404).send({ message: "User not registered" });
        const isPw = await bcrypt_1.default.compare(req.body.password, user.password);
        if (!isPw)
            return res.status(400).send({ message: "Invalid email or password." });
        const token = user.genAuthToken();
        const decodedToken = (0, user_2.decodeUserToken)(token);
        res.send({
            message: "Logged in successfully",
            data: {
                id: user._id,
                token,
                tokenExpirationDate: decodedToken.exp,
            },
        });
    }
    catch (err) {
        next(new Error("Error in Logging user in: " + err));
    }
};
exports.login = login;
const getUser = async (req, res, next) => {
    try {
        const userId = req["user"].id;
        const user = await user_1.default.findById(userId).select("name phone email address shops");
        if (!user)
            return res.status(404).send({ message: "No user with the given ID." });
        user._doc.hasShop = user.shops.length > 0;
        res.send({ message: "User's data fetched successfully.", data: user });
    }
    catch (err) {
        next(new Error("Error in getting user's data: " + err));
    }
};
exports.getUser = getUser;
const updateAddress = async (req, res, next) => {
    try {
        const { error } = fromUser.validateAddress(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const userId = req["user"].id;
        const { address } = req.body;
        await user_1.default.updateOne({ _id: userId }, { address });
        res.send({ message: "Address updated successfully" });
    }
    catch (err) {
        next(new Error("Error in updating address: " + err));
    }
};
exports.updateAddress = updateAddress;
const updatePhone = async (req, res, next) => {
    try {
        const { error } = fromUser.validatePhoneNumber(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const userId = req["user"].id;
        const { phone } = req.body;
        await user_1.default.updateOne({ _id: userId }, { phone });
        res.send({ message: "Phone number updated successfully" });
    }
    catch (err) {
        next(new Error("Error in updating phone number: " + err));
    }
};
exports.updatePhone = updatePhone;
const changePassword = async (req, res, next) => {
    try {
        const { error } = fromUser.validateChangePwData(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const userId = req["user"].id;
        const user = await user_1.default.findById(userId);
        const isPw = await bcrypt_1.default.compare(req.body.oldPassword, user.password);
        if (!isPw)
            return res.status(400).send({ message: "Incorrect password." });
        const hashedPw = await bcrypt_1.default.hash(req.body.newPassword, 10);
        await user_1.default.updateOne({ _id: userId }, { password: hashedPw });
        res.send({ message: "Password changed successfully." });
    }
    catch (err) {
        next(new Error("Error in changing password: " + err));
    }
};
exports.changePassword = changePassword;
