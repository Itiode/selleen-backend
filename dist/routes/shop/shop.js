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
const shopCtrl = __importStar(require("../../controllers/shop/shop"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const owner_1 = __importDefault(require("../../middleware/owner"));
const router = (0, express_1.default)();
router.get("/alias/:alias", shopCtrl.getShopByAlias);
router.get("/:shopId", shopCtrl.getShopById);
router.patch("/:shopId", auth_1.default, owner_1.default, shopCtrl.updateShop);
router.patch("/:shopId/logo", auth_1.default, owner_1.default, shopCtrl.updateLogo);
router.delete("/:shopId/logo", auth_1.default, owner_1.default, shopCtrl.deleteLogo);
router.patch("/:shopId/banners", auth_1.default, owner_1.default, shopCtrl.updateBanners);
router.delete("/:shopId/banners", auth_1.default, owner_1.default, shopCtrl.deleteBanners);
router.patch("/:shopId/social-media-links", auth_1.default, owner_1.default, shopCtrl.updateSMLinks);
router.patch("/:shopId/payment-details", auth_1.default, owner_1.default, shopCtrl.updatePaymentDetails);
router.patch("/:shopId/personal-id", auth_1.default, owner_1.default, shopCtrl.addPersonalId);
router.delete("/:shopId/personal-id", auth_1.default, owner_1.default, shopCtrl.deletePersonalId);
exports.default = router;
