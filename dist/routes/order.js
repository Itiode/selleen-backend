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
const express_1 = require("express");
const orderCtrl = __importStar(require("../controllers/order"));
const auth_1 = __importDefault(require("../middleware/auth"));
const owner_1 = __importDefault(require("../middleware/owner"));
const router = (0, express_1.Router)();
router.post("/place-order/:userId", orderCtrl.placeOrder);
router.put("/save-order", auth_1.default, orderCtrl.saveOrder);
router.get("/me", auth_1.default, orderCtrl.getUserOrder);
router.get("/shop/:shopId", auth_1.default, owner_1.default, orderCtrl.getShopOrders);
router.get("/shop/:shopId/count", auth_1.default, owner_1.default, orderCtrl.getShopOrderCount);
router.put("/:shopId/:orderId", auth_1.default, owner_1.default, orderCtrl.updateOrderStatus);
exports.default = router;
