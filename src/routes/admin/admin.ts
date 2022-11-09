import Router from "express";

import * as adminAuthCtrl from "../../controllers/admin/auth";
import * as adminCtrl from "../../controllers/admin/admin";
import admin from "../../middleware/admin";

const router = Router();

router.post("/signup", adminAuthCtrl.signup);
router.post("/login", adminAuthCtrl.login);
router.get("/me", admin, adminCtrl.getAdmin);

export default router;
