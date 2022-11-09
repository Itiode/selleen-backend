import { RequestHandler } from "express";
import bcrypt from "bcrypt";

import { AuthReqBody, AuthResBody } from "../../types/shared";
import * as adminTypes from "../../types/admin/admin";
import AdminModel, * as fromAdmin from "../../models/admin/admin";
import { decodeAdminToken } from "../../utils/admin";

export const signup: RequestHandler<
  any,
  AuthResBody,
  adminTypes.SignupReqBody
> = async (req, res, next) => {
  try {
    const { error } = fromAdmin.validateSignupData(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { name, email, address, phone, password } = req.body;

    let fetchedAdmin = await AdminModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (fetchedAdmin)
      return res.status(400).send({ message: "Admin already registered" });

    const hashedPw = await bcrypt.hash(password, 10);

    const admin = new AdminModel({
      name,
      email,
      address,
      phone,
      password: hashedPw,
    });

    await admin.save();

    const token = admin.genAuthToken();
    const decodedToken = decodeAdminToken(token);

    res.status(201).send({
      message: "Admin signed up successfully",
      data: {
        id: admin._id,
        token,
        tokenExpirationDate: decodedToken.exp,
      },
    });
  } catch (e) {
    next(new Error("Error in signing up admin: " + e));
  }
};

export const login: RequestHandler<any, AuthResBody, AuthReqBody> = async (
  req,
  res,
  next
) => {
  const { error } = fromAdmin.validateLoginData(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const fetchedAdmin = await AdminModel.findOne({
      email: req.body.email,
    }).select("password permissions");

    if (!fetchedAdmin)
      return res.status(404).send({ message: "Admin not registered" });

    const isPw = await bcrypt.compare(req.body.password, fetchedAdmin.password);
    if (!isPw)
      return res.status(400).send({ message: "Invalid email or password." });

    const token = fetchedAdmin.genAuthToken();
    const decodedToken = decodeAdminToken(token);

    res.send({
      message: "Logged in successfully",
      data: {
        id: fetchedAdmin._id,
        token,
        tokenExpirationDate: decodedToken.exp,
      },
    });
  } catch (err) {
    next(new Error("Error in Logging admin in: " + err));
  }
};
