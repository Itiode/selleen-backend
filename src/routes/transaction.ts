import Router from "express";

import auth from "../middleware/auth";
import owner from "../middleware/owner";
import * as transCtrl from "../controllers/transaction";

const router = Router();

router.post(
  "/shop/initiate-withdrawal",
  auth,
  owner,
  transCtrl.initiateWithdrawal
);
router.get("/shop/:shopId", auth, owner, transCtrl.getShopTransactions);
router.get("/shop/:shopId/balance", auth, owner, transCtrl.getShopBalance);
router.get(
  "/shop/:shopId/total-withdrawal",
  auth,
  owner,
  transCtrl.getShopTotalWithdrawal
);
router.get(
  "/shop/:shopId/total-revenue",
  auth,
  owner,
  transCtrl.getShopTotalRevenue
);

export default router;
