import { RequestHandler } from "express";

import AdminModel from "../../models/admin/admin";
import * as adminTypes from "../../types/admin/admin";

export const getAdmin: RequestHandler<any, adminTypes.GetAdminResBody> = async (
  req,
  res,
  next
) => {
  try {
    const adminId = req["admin"].id;

    const admin = await AdminModel.findById(adminId).select(
      "name phone email address permissions"
    );

    if (!admin)
      return res.status(404).send({ message: "No admin with the given ID." });

    res.send({ message: "Admin's data fetched successfully.", data: admin });
  } catch (err) {
    next(new Error("Error in getting admin's data: " + err));
  }
};
