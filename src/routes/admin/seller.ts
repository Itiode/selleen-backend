import Router from "express";

import * as adminSellerCtrl from "../../controllers/admin/seller";
import admin from "../../middleware/admin";
import permission from "../../middleware/permission";

const router = Router();

router.get(
  "/count",
  admin,
  permission("ViewSellerCount"),
  adminSellerCtrl.sellerCount
);

export default router;
