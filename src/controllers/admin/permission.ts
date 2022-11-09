import { RequestHandler } from "express";

import * as permissionTypes from "../../types/admin/permission";
import PermissionModel, * as fromPermission from "../../models/admin/permission";
import { SimpleResBody } from "../../types/shared";
import AdminModel from "../../models/admin/admin";

export const createPermission: RequestHandler<
  any,
  SimpleResBody,
  permissionTypes.CreatePermissionReqBody
> = async (req, res, next) => {
  try {
    const { error } = fromPermission.validateCreatePermissionData(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { name } = req.body;

    const foundPermissn = await PermissionModel.findOne({ name });
    if (foundPermissn)
      return res
        .status(400)
        .send({ message: "A permission with this name exists already" });

    new PermissionModel({ name }).save();

    res.status(201).send({ message: "Permission created successfully" });
  } catch (e) {
    next(new Error("Error in creating permission: " + e));
  }
};

export const addPermissions: RequestHandler<
  any,
  SimpleResBody,
  permissionTypes.AddPermissionsReqBody
> = async (req, res, next) => {
  try {
    const { error } = fromPermission.validateAddPermissionsData(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { names, adminId } = req.body;

    const foundAdmin = await AdminModel.findById(adminId);
    if (!foundAdmin)
      return res.status(404).send({ message: "No admin with the given ID" });

    const added: string[] = [];
    const notAdded: string[] = [];

    for (let name of names) {
      const foundPermissn = await PermissionModel.findOne({ name }).select(
        "_id"
      );

      if (foundPermissn) {
        added.push(name);
      } else {
        notAdded.push(name);
      }
    }

    await AdminModel.updateOne(
      { _id: adminId },
      { $addToSet: { permissions: { $each: added } } }
    );

    const message = `Added (${added.length}): ${added.join(
      ", "
    )}. Couldn't add (${notAdded.length}): ${notAdded.join(", ")}.`;

    res.status(200).send({ message });
  } catch (e) {
    next(new Error("Error in adding permission(s): " + e));
  }
};
