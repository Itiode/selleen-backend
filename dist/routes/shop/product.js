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
const auth_1 = __importDefault(require("../../middleware/auth"));
const owner_1 = __importDefault(require("../../middleware/owner"));
const prodCtrl = __importStar(require("../../controllers/shop/product/product"));
const prodVCtrl = __importStar(require("../../controllers/shop/product/variation"));
const router = (0, express_1.Router)();
router.post("/", auth_1.default, owner_1.default, prodCtrl.addOrEditProduct);
router.get("/:shopId", auth_1.default, owner_1.default, prodCtrl.getProducts);
router.put("/:productId", auth_1.default, owner_1.default, prodCtrl.addOrEditProduct);
router.delete("/:shopId/:productId", auth_1.default, owner_1.default, prodCtrl.deleteProduct);
router.delete("/:shopId/:productId/images", auth_1.default, owner_1.default, prodCtrl.deleteProductImages);
router.post("/variations", auth_1.default, owner_1.default, prodVCtrl.addVariation);
router.get("/variations/:shopId", auth_1.default, owner_1.default, prodVCtrl.getVariations);
router.delete("/variations/:productVariationId/:shopId", auth_1.default, owner_1.default, prodVCtrl.deleteVariation);
exports.default = router;