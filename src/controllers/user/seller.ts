import mongoose from "mongoose";
import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";

import * as UserTypes from "../../types/user";
import UserModel, * as fromUser from "../../models/user";
import ShopModel from "../../models/shop";
import {
  AuthResBody,
  GetTodosResBody,
  SimpleReqParam,
  Todo,
} from "../../types/shared";
import { decodeUserToken } from "../../utils/user";

export const getTodos: RequestHandler<SimpleReqParam, GetTodosResBody> = async (
  req,
  res,
  next
) => {
  try {
    const shopId = req.params.shopId;

    const todos: Todo[] = [];
    const shop = await ShopModel.findById(shopId).select(
      "alias contactLines banners logo socialMediaLinks personalId paymentDetails"
    );

    if (!shop)
      return res.status(404).send({ message: "No shop with the given ID" });

    if (!shop.logo)
      todos.push({
        message: "Add a logo to promote your shop's identity",
      });
    if (!shop.banners || shop.banners.length < 1)
      todos.push({
        message: "Add a banner to beautify your shop.",
      });
    if (!shop.alias)
      todos.push({ message: "Add a shop alias to generate a shop link." });
    if (!shop.contactLines || shop.contactLines.length < 1)
      todos.push({ message: "Add contact lines for your shop." });
    if (!shop.paymentDetails.bankAccountDetails.accountName)
      todos.push({ message: "Add your bank account details" });
    if (!shop.socialMediaLinks || shop.socialMediaLinks.length < 1)
      todos.push({ message: "Add your shops's social media link(s)." });
    if (!shop.personalId)
      todos.push({
        message: "Add a personal ID, so your shop can be approved.",
      });

    res.send({ message: "Todos gotten successfully", data: { todos } });
  } catch (e) {
    next(new Error("Error in getting todos: " + e));
  }
};

export const signup: RequestHandler<
  any,
  AuthResBody,
  UserTypes.SellerSignupReqBody
> = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { error } = fromUser.validateSellerSignupData(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const {
      name,
      email,
      phone,
      shopName,
      shopEmail,
      shopAddress,
      knowOf,
      coords,
      password,
    } = req.body;

    let fetchedUser = await UserModel.findOne({
      $or: [{ email }, { phone }],
    }).select("_id");
    if (fetchedUser)
      return res.status(400).send({ message: "User already registered." });

    const fetchedShop = await ShopModel.findOne({ email: shopEmail });
    if (fetchedShop)
      return res
        .status(400)
        .send({ message: "A shop with this Email exists already." });

    const hashedPw = await bcrypt.hash(password, 10);

    const newUser = await new UserModel({
      name,
      email,
      phone,
      password: hashedPw,
      knowOf,
    }).save({ session });

    const shortId = customAlphabet("1234567890abcdef", 10)();

    const shop = new ShopModel({
      shortId,
      name: shopName,
      email: shopEmail,
      address: shopAddress,
      creator: {
        userId: newUser._id,
        name: newUser.name,
      },
      owners: [
        {
          userId: newUser._id,
          name: newUser.name,
        },
      ],
      location: { type: "Point", coordinates: [coords.lng, coords.lat] },
    });

    await UserModel.updateOne(
      { _id: newUser._id },
      {
        $push: {
          roles: {
            name: "Owner",
            shopId: shop._id,
          },
          shops: { name: shop.name, id: shop._id },
        },
      },
      { session }
    );

    await shop.save({ session });

    await session.commitTransaction();

    const user = await UserModel.findById(newUser._id).select("roles");

    const token = user.genAuthToken();
    const decodedToken = decodeUserToken(token);

    res.status(201).send({
      message: "Seller signed up successfully.",
      data: {
        id: newUser._id,
        token,
        tokenExpirationDate: decodedToken.exp,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    next(new Error("Error in signing up seller: " + err));
  } finally {
    session.endSession();
  }
};
