import { RequestHandler } from "express";

import UserModel from "../../models/user";
import { GetEntityCountResBody } from "../../types/shared";

export const buyerCount: RequestHandler<any, GetEntityCountResBody> = async (
  req,
  res,
  next
) => {
  try {
    const totalBuyers = await UserModel.find({
      shops: { $exists: true, $size: 0 },
    }).countDocuments();

    res.send({
      message: "Buyer count retrieved successfully",
      data: { count: totalBuyers },
    });
  } catch (e) {
    next(new Error("Error in getting buyer count: " + e));
  }
};
