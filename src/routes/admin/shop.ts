import Router from "express";

import * as shopCtrl from "../../controllers/admin/shop";
import permission from "../../middleware/permission";
import admin from "../../middleware/admin";

const router = Router();

router.get("/", admin, permission("ViewShops"), shopCtrl.getShops);
router.patch(
  "/:shopId/approve",
  admin,
  permission("ApproveShop"),
  shopCtrl.approveShop
);

export default router;
