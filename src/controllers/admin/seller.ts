import { RequestHandler } from "express";

import UserModel from "../../models/user";
import { GetEntityCountResBody } from "../../types/shared";

export const sellerCount: RequestHandler<any, GetEntityCountResBody> = async (
  req,
  res,
  next
) => {
  try {
    const totalSellers = await UserModel.find({
      shops: { $exists: true, $not: { $size: 0 } },
    }).countDocuments();

    res.send({
      message: "Seller count retrieved successfully",
      data: { count: totalSellers },
    });
  } catch (e) {
    next(new Error("Error in getting seller count: " + e));
  }
};
