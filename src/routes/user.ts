import Router from "express";

import * as buyerCtrl from "../controllers/user/buyer";
import * as sellerCtrl from "../controllers/user/seller";
import * as sharedCtrl from "../controllers/user/shared";
import auth from "../middleware/auth";
import owner from "../middleware/owner";

const router = Router();

router.post("/buyers/signup", buyerCtrl.signup);
router.post("/sellers/signup", sellerCtrl.signup);
router.post("/login", sharedCtrl.login);

router.get("/me", auth, sharedCtrl.getUser);
router.get("/seller/todos/:shopId", auth, owner, sellerCtrl.getTodos);

router.patch("/me/update-address", auth, sharedCtrl.updateAddress);
router.patch("/me/update-phone", auth, sharedCtrl.updatePhone);
router.patch("/me/change-password", auth, sharedCtrl.changePassword);

// router.get("/", auth, userCtrl.getUsers);

// router.patch("/:id", auth, userCtrl.updateUser);

// router.delete("/:id", auth, userCtrl.removeUser);

export default router;
