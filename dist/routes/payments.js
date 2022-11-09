"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bank_transfer_1 = require("../controllers/payments/bank-transfer");
const payment_event_1 = require("../controllers/payments/payment-event");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.default)();
router.get("/bank-transfer-details", auth_1.default, bank_transfer_1.getBankTransferDetails);
router.post("/event", payment_event_1.processEvent);
exports.default = router;
