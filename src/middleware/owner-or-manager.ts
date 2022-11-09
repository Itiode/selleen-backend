import Shop from "../models/shop";
import { Role } from "../types/shared";

export default async (req: any, res: any, next: any) => {
  try {
    const ownerOrManager = req.user.roles.find(
      (r: Role) => r.name === "Owner" || r.name === "Manager"
    );

    if (!ownerOrManager)
      return res
        .status(403)
        .send({ message: "User is not an owner or manager." });

    const shopId = req.body.shopId;
    const shop = await Shop.findOne({
      $or: [
        {
          _id: shopId,
          "owners.userId": req.user.id,
        },
        {
          _id: shopId,
          "managers.userId": req.user.id,
        },
      ],
    }).select("owners managers -_id");

    if (!shop)
      return res
        .status(403)
        .send({ message: "User is not an owner or manager for this shop." });

    next();
  } catch (err: any) {
    next(new Error("Error in verifying owner or manager: " + err.message));
  }
};
