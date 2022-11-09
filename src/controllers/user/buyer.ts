import { RequestHandler } from "express";
import bcrypt from "bcrypt";

import * as UserTypes from "../../types/user";
import UserModel, { validateBuyerSignupData } from "../../models/user";
import { AuthResBody } from "../../types/shared";
import { decodeUserToken } from "../../utils/user";

export const signup: RequestHandler<
  any,
  AuthResBody,
  UserTypes.BuyerSignupReqBody
> = async (req, res, next) => {
  try {
    const { error } = validateBuyerSignupData(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { name, phone, email, password } = req.body;

    let fetchedUser = await UserModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (fetchedUser)
      return res.status(400).send({ message: "User already registered" });

    const hashedPw = await bcrypt.hash(password, 10);

    const user = await new UserModel({
      name,
      phone,
      email,
      password: hashedPw,
    }).save();

    const token = user.genAuthToken();
    const decodedToken = decodeUserToken(token);

    res.status(201).send({
      message: "Signed up successfully",
      data: {
        id: user._id,
        token,
        tokenExpirationDate: decodedToken.exp,
      },
    });
  } catch (err) {
    next(new Error("Error in signing user up: " + err));
  }
};
