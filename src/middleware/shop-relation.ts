import Shop from "../models/shop";
import { Role } from "../types/shared";

export default async (req: any, res: any, next: any) => {
  try {
    const shopRel = req.user.roles.find(
      (r: Role) =>
        r.name === "Owner" || r.name === "Manager" || r.name === "SupportStaff"
    );

    if (!shopRel)
      return res
        .status(403)
        .send({ message: "User is not related to any shop." });

    const shopId = req.params.shopId;
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
        {
          _id: shopId,
          "supportStaff.userId": req.user.id,
        },
      ],
    }).select("owners managers supportStaff -_id");

    if (!shop)
      return res
        .status(403)
        .send({ message: "User is not related to this shop." });

    next();
  } catch (err: any) {
    next(
      new Error("Error in verifying user's relation to shop: " + err.message)
    );
  }
};
