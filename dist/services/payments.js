"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateTransfer = exports.initiateBankTransfer = void 0;
const config_1 = __importDefault(require("config"));
const Flutterwave = require("flutterwave-node-v3");
const nanoid_1 = require("nanoid");
const flw = new Flutterwave(config_1.default.get("flutterwavePublicKey"), config_1.default.get("flutterwaveSecretKey"));
function getTransferRef() {
    return `SLN_TXREF_${(0, nanoid_1.nanoid)()}`;
}
async function initiateBankTransfer(data, userId) {
    try {
        const details = {
            tx_ref: `${getTransferRef()}_USER_ID=${userId}`,
            amount: data.amount,
            email: data.email,
            currency: "NGN",
        };
        return await flw.Charge.bank_transfer(details);
    }
    catch (e) {
        return { status: "error", message: "Failed" };
    }
}
exports.initiateBankTransfer = initiateBankTransfer;
async function initiateTransfer(data) {
    try {
        const details = {
            account_bank: data.bankName,
            account_number: data.accountNumber,
            amount: data.amount,
            currency: "NGN",
            narration: "Settlement for processed orders (Selleen).",
            reference: `${getTransferRef()}`,
        };
        return await flw.Transfer.initiate(details);
    }
    catch (e) {
        return { status: "error", message: "Failed" };
    }
}
exports.initiateTransfer = initiateTransfer;
