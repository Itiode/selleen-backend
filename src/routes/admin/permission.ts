import Router from "express";

import * as permissnCtrl from "../../controllers/admin/permission";
import permission from "../../middleware/permission";
import admin from "../../middleware/admin";

const router = Router();

router.post(
  "/create",
  admin,
  permission("CreatePermission"),
  permissnCtrl.createPermission
);
router.post(
  "/add",
  admin,
  permission("AddPermission"),
  permissnCtrl.addPermissions
);

export default router;
