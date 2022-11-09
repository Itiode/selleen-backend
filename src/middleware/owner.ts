import { Role } from "../types/shared";

export default async (req: any, res: any, next: any) => {
  try {
    const shopId = req.body.shopId || req.params.shopId;

    if (!shopId) {
      return res
        .status(401)
        .send({ message: "Shop ID is required for validating owner." });
    }

    let isOwner: any;
    if (req.user.roles) {
      isOwner = req.user.roles.find(
        (r: Role) => r.name === "Owner" && r.shopId === shopId
      );
    }

    if (!isOwner)
      return res
        .status(403)
        .send({ message: "User is not an owner for this shop." });

    next();
  } catch (err: any) {
    next(new Error("Error in verifying owner: " + err.message));
  }
};
