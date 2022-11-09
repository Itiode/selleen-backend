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
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const owner_1 = __importDefault(require("../middleware/owner"));
const transCtrl = __importStar(require("../controllers/transaction"));
const router = (0, express_1.default)();
router.post("/shop/initiate-withdrawal", auth_1.default, owner_1.default, transCtrl.initiateWithdrawal);
router.get("/shop/:shopId", auth_1.default, owner_1.default, transCtrl.getShopTransactions);
router.get("/shop/:shopId/balance", auth_1.default, owner_1.default, transCtrl.getShopBalance);
router.get("/shop/:shopId/total-withdrawal", auth_1.default, owner_1.default, transCtrl.getShopTotalWithdrawal);
router.get("/shop/:shopId/total-revenue", auth_1.default, owner_1.default, transCtrl.getShopTotalRevenue);
exports.default = router;
