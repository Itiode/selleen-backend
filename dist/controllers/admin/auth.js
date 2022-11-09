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
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_1 = __importStar(require("../../models/admin/admin")), fromAdmin = admin_1;
const admin_2 = require("../../utils/admin");
const signup = async (req, res, next) => {
    try {
        const { error } = fromAdmin.validateSignupData(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { name, email, address, phone, password } = req.body;
        let fetchedAdmin = await admin_1.default.findOne({
            $or: [{ email }, { phone }],
        });
        if (fetchedAdmin)
            return res.status(400).send({ message: "Admin already registered" });
        const hashedPw = await bcrypt_1.default.hash(password, 10);
        const admin = new admin_1.default({
            name,
            email,
            address,
            phone,
            password: hashedPw,
        });
        await admin.save();
        const token = admin.genAuthToken();
        const decodedToken = (0, admin_2.decodeAdminToken)(token);
        res.status(201).send({
            message: "Admin signed up successfully",
            data: {
                id: admin._id,
                token,
                tokenExpirationDate: decodedToken.exp,
            },
        });
    }
    catch (e) {
        next(new Error("Error in signing up admin: " + e));
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    const { error } = fromAdmin.validateLoginData(req.body);
    if (error)
        return res.status(400).send({ message: error.details[0].message });
    try {
        const fetchedAdmin = await admin_1.default.findOne({
            email: req.body.email,
        }).select("password permissions");
        if (!fetchedAdmin)
            return res.status(404).send({ message: "Admin not registered" });
        const isPw = await bcrypt_1.default.compare(req.body.password, fetchedAdmin.password);
        if (!isPw)
            return res.status(400).send({ message: "Invalid email or password." });
        const token = fetchedAdmin.genAuthToken();
        const decodedToken = (0, admin_2.decodeAdminToken)(token);
        res.send({
            message: "Logged in successfully",
            data: {
                id: fetchedAdmin._id,
                token,
                tokenExpirationDate: decodedToken.exp,
            },
        });
    }
    catch (err) {
        next(new Error("Error in Logging admin in: " + err));
    }
};
exports.login = login;
