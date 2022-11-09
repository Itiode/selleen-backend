import { Router } from "express";

import * as orderCtrl from "../controllers/order";
import auth from "../middleware/auth";
import owner from "../middleware/owner";

const router = Router();

router.post("/place-order/:userId", orderCtrl.placeOrder);
router.put("/save-order", auth, orderCtrl.saveOrder);
router.get("/me", auth, orderCtrl.getUserOrder);
router.get("/shop/:shopId", auth, owner, orderCtrl.getShopOrders);
router.get("/shop/:shopId/count", auth, owner, orderCtrl.getShopOrderCount);
router.put("/:shopId/:orderId", auth, owner, orderCtrl.updateOrderStatus);

export default router;
