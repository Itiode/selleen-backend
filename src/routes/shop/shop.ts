import Router from "express";

import * as shopCtrl from "../../controllers/shop/shop";
import auth from "../../middleware/auth";
import owner from "../../middleware/owner";

const router = Router();

router.get("/alias/:alias", shopCtrl.getShopByAlias);
router.get("/:shopId", shopCtrl.getShopById);
router.patch("/:shopId", auth, owner, shopCtrl.updateShop);
router.patch("/:shopId/logo", auth, owner, shopCtrl.updateLogo);
router.delete("/:shopId/logo", auth, owner, shopCtrl.deleteLogo);
router.patch("/:shopId/banners", auth, owner, shopCtrl.updateBanners);
router.delete("/:shopId/banners", auth, owner, shopCtrl.deleteBanners);
router.patch(
  "/:shopId/social-media-links",
  auth,
  owner,
  shopCtrl.updateSMLinks
);
router.patch(
  "/:shopId/payment-details",
  auth,
  owner,
  shopCtrl.updatePaymentDetails
);
router.patch("/:shopId/personal-id", auth, owner, shopCtrl.addPersonalId);
router.delete("/:shopId/personal-id", auth, owner, shopCtrl.deletePersonalId);

export default router;
