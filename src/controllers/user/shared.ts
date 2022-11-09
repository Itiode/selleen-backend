import { RequestHandler } from "express";
import bcrypt from "bcrypt";

import UserModel, * as fromUser from "../../models/user";
import * as userTypes from "../../types/user";
import { AuthResBody, AuthReqBody } from "../../types/shared";
import { SimpleResBody } from "../../types/shared";
import { decodeUserToken } from "../../utils/user";

export const login: RequestHandler<any, AuthResBody, AuthReqBody> = async (
  req,
  res,
  next
) => {
  const { error } = fromUser.validateLoginData(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const user = await UserModel.findOne({ email: req.body.email }).select(
      "password roles"
    );

    if (!user) return res.status(404).send({ message: "User not registered" });

    const isPw = await bcrypt.compare(req.body.password, user.password);
    if (!isPw)
      return res.status(400).send({ message: "Invalid email or password." });

    const token = user.genAuthToken();
    const decodedToken = decodeUserToken(token);

    res.send({
      message: "Logged in successfully",
      data: {
        id: user._id,
        token,
        tokenExpirationDate: decodedToken.exp,
      },
    });
  } catch (err) {
    next(new Error("Error in Logging user in: " + err));
  }
};

export const getUser: RequestHandler<any, userTypes.GetUserResBody> = async (
  req,
  res,
  next
) => {
  try {
    const userId = req["user"].id;
    const user = await UserModel.findById(userId).select(
      "name phone email address shops"
    );

    if (!user)
      return res.status(404).send({ message: "No user with the given ID." });

    user._doc.hasShop = user.shops.length > 0;

    res.send({ message: "User's data fetched successfully.", data: user });
  } catch (err) {
    next(new Error("Error in getting user's data: " + err));
  }
};

export const updateAddress: RequestHandler<
  any,
  SimpleResBody,
  userTypes.UpdateUserAddressReqBody
> = async (req, res, next) => {
  try {
    const { error } = fromUser.validateAddress(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const userId = req["user"].id;

    const { address } = req.body;

    await UserModel.updateOne({ _id: userId }, { address });

    res.send({ message: "Address updated successfully" });
  } catch (err) {
    next(new Error("Error in updating address: " + err));
  }
};

export const updatePhone: RequestHandler<
  any,
  SimpleResBody,
  userTypes.UpdateUserPhoneReqBody
> = async (req, res, next) => {
  try {
    const { error } = fromUser.validatePhoneNumber(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const userId = req["user"].id;

    const { phone } = req.body;

    await UserModel.updateOne({ _id: userId }, { phone });

    res.send({ message: "Phone number updated successfully" });
  } catch (err) {
    next(new Error("Error in updating phone number: " + err));
  }
};

export const changePassword: RequestHandler<
  any,
  SimpleResBody,
  userTypes.ChangePwReqBody
> = async (req, res, next) => {
  try {
    const { error } = fromUser.validateChangePwData(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const userId = req["user"].id;
    const user = await UserModel.findById(userId);

    const isPw = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isPw) return res.status(400).send({ message: "Incorrect password." });

    const hashedPw = await bcrypt.hash(req.body.newPassword, 10);
    await UserModel.updateOne({ _id: userId }, { password: hashedPw });

    res.send({ message: "Password changed successfully." });
  } catch (err) {
    next(new Error("Error in changing password: " + err));
  }
};
