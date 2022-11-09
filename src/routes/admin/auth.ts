import Router from "express";

import * as adminAuthCtrl from "../../controllers/admin/auth";

const router = Router();

router.post("/signup", adminAuthCtrl.signup);
router.post("/login", adminAuthCtrl.login);

export default router;
