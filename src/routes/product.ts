import Router from "express";

import auth from "../middleware/auth";
import * as prodCtrl from "../controllers/product/product";
import * as prodReviewCtrl from "../controllers/product/review";

const router = Router();

router.get("/", prodCtrl.getProducts);
router.get("/shop/:shopId", prodCtrl.getShopProducts);
router.get("/:productId", prodCtrl.getProduct);
// router.patch("/add-to-cart", auth, prodCtrl.addToCart);
router.post("/:productId/review", auth, prodReviewCtrl.addReview);
// router.put("/:productId/review/:reviewId", auth, prodReviewCtrl.addOrEditReview);

export default router;
