import Router from "express";

import * as prodCtrl from "../../controllers/admin/product";
import permission from "../../middleware/permission";
import admin from "../../middleware/admin";

const router = Router();

router.get("/", admin, permission("ViewProducts"), prodCtrl.getProducts);
router.get(
  "/count",
  admin,
  permission("ViewProductCount"),
  prodCtrl.getProductCount
);
router.patch(
  "/:productId/approve",
  admin,
  permission("ApproveProduct"),
  prodCtrl.approveProduct
);

export default router;
