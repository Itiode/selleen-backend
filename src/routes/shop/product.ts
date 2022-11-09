import { Router } from "express";

import auth from "../../middleware/auth";
import owner from "../../middleware/owner";
import * as prodCtrl from "../../controllers/shop/product/product";
import * as prodVCtrl from "../../controllers/shop/product/variation";

const router = Router();

router.post("/", auth, owner, prodCtrl.addOrEditProduct);
router.get("/:shopId", auth, owner, prodCtrl.getProducts);
router.put("/:productId", auth, owner, prodCtrl.addOrEditProduct);
router.delete("/:shopId/:productId", auth, owner, prodCtrl.deleteProduct);
router.delete(
  "/:shopId/:productId/images",
  auth,
  owner,
  prodCtrl.deleteProductImages
);

router.post("/variations", auth, owner, prodVCtrl.addVariation);
router.get("/variations/:shopId", auth, owner, prodVCtrl.getVariations);
router.delete(
  "/variations/:productVariationId/:shopId",
  auth,
  owner,
  prodVCtrl.deleteVariation
);

export default router;
