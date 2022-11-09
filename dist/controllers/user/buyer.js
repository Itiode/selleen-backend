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
exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importStar(require("../../models/user"));
const user_2 = require("../../utils/user");
const signup = async (req, res, next) => {
    try {
        const { error } = (0, user_1.validateBuyerSignupData)(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { name, phone, email, password } = req.body;
        let fetchedUser = await user_1.default.findOne({
            $or: [{ email }, { phone }],
        });
        if (fetchedUser)
            return res.status(400).send({ message: "User already registered" });
        const hashedPw = await bcrypt_1.default.hash(password, 10);
        const user = await new user_1.default({
            name,
            phone,
            email,
            password: hashedPw,
        }).save();
        const token = user.genAuthToken();
        const decodedToken = (0, user_2.decodeUserToken)(token);
        res.status(201).send({
            message: "Signed up successfully",
            data: {
                id: user._id,
                token,
                tokenExpirationDate: decodedToken.exp,
            },
        });
    }
    catch (err) {
        next(new Error("Error in signing user up: " + err));
    }
};
exports.signup = signup;
