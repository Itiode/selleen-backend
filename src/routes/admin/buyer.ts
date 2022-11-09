import Router from "express";

import * as adminBuyerCtrl from "../../controllers/admin/buyer";
import admin from "../../middleware/admin";
import permission from "../../middleware/permission";

const router = Router();

router.get(
  "/count",
  admin,
  permission("ViewBuyerCount"),
  adminBuyerCtrl.buyerCount
);

export default router;
