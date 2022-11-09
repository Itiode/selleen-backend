import { RequestHandler } from "express";
import { customAlphabet } from "nanoid";

import ShopModel, * as fromShop from "../../models/shop";
import User from "../../models/user";
import * as shopTypes from "../../types/shop/shop";
import { PersonalId, SimpleReqParam, SimpleResBody } from "../../types/shared";
import { ValidationError } from "joi";
import { validateSimpleReqParam } from "../../models/validators/shared";
import { deleteFileFromS3 } from "../../services/s3";

// TODO: Use a transaction to save shop and update user's shops and roles.
// export const createShop: RequestHandler<
//   any,
//   CreateShopResBody,
//   CreateShopReqBody
// > = async (req, res, next) => {
//   const { error } = validateCreateShopReqBody(req.body);
//   if (error) return res.status(422).send({ message: error.details[0].message });

//   const creatorId = req["user"].id;
//   const { name, alias, description, email, address, contactLines, coords } =
//     req.body;

//   try {
//     const fetchedShop = await Shop.findOne({ email });
//     if (fetchedShop)
//       return res
//         .status(400)
//         .send({ message: "A shop with this E-Mail exists already." });

//     const user = await User.findById(creatorId).select("name");

//     if (!user)
//       return res.status(404).send({ message: "No user with the given ID." });

//     const shortId = customAlphabet("1234567890abcdef", 10)();

//     const shop = new Shop({
//       shortId,
//       name,
//       alias,
//       description,
//       email,
//       creator: {
//         name: user.name,
//         userId: user._id,
//       },
//       owners: [
//         {
//           name: user.name,
//           userId: user._id,
//         },
//       ],
//       contactLines,
//       address,
//       location: { type: "Point", coordinates: [coords.lng, coords.lat] },
//     });

//     await shop.save();

//     await User.updateOne(
//       { _id: user._id },
//       {
//         $push: {
//           shops: { name: shop.name, id: shop._id },
//         },
//       }
//     );

//     await User.updateOne(
//       { _id: user._id },
//       {
//         $push: {
//           roles: {
//             name: "Owner",
//             shopId: shop._id,
//           },
//         },
//       }
//     );

//     res.status(201).send({
//       message: "Shop created successfully!",
//       data: {
//         _id: shop._id,
//         name,
//       },
//     });
//   } catch (err) {
//     next(new Error("Error in creating shop: " + err));
//   }
// };

export const getShopById: RequestHandler<
  SimpleReqParam,
  shopTypes.GetShopByIdResBody
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const shopId = req.params.shopId;
    const shop = await ShopModel.findById(shopId).select(
      "-__v -createdAt -updatedAt -balance"
    );
    if (!shop)
      return res.status(404).send({
        message: "No shop found",
      });

    res.send({
      message: "Shop gotten successfully",
      data: shop,
    });
  } catch (err) {
    next(new Error("Error in getting shop: " + err));
  }
};

export const getShopByAlias: RequestHandler<
  shopTypes.GetShopByAliasReqParam,
  shopTypes.GetShopByAliasResBody
> = async (req, res, next) => {
  try {
    const { error } = fromShop.validateShopAlias(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const alias = req.params.alias;
    const shop = await ShopModel.findOne({ alias }).select(
      "name alias description logo banners contactLines address rating approved socialMediaLinks createdAt"
    );
    if (!shop)
      return res.status(404).send({
        message: "No shop found",
      });

    res.send({
      message: "Shop gotten successfully",
      data: shop,
    });
  } catch (err) {
    next(new Error("Error in getting shop: " + err));
  }
};

export const updateShop: RequestHandler<
  SimpleReqParam,
  SimpleResBody,
  shopTypes.UpdateShopReqBody
> = async (req, res, next) => {
  try {
    let error: ValidationError | undefined;

    error = validateSimpleReqParam(req.params).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    error = fromShop.validateUpdateShopData(req.body).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { alias, address, contactLines, description } = req.body;
    const { shopId } = req.params;

    const fetchedShop = await ShopModel.findById(shopId);
    if (!fetchedShop)
      return res.status(404).send({ message: "No shop found." });

    await ShopModel.updateOne(
      { _id: shopId },
      {
        $set: {
          alias,
          address,
          contactLines,
          description,
        },
      }
    );
    res.send({ message: "Shop updated successfully" });
  } catch (err) {
    next(new Error("Error in updating shop: " + err));
  }
};

export const updateLogo: RequestHandler<
  SimpleReqParam,
  SimpleResBody,
  { url: string }
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    await ShopModel.updateOne(
      { _id: req.params.shopId },
      { logo: { url: req.body.url } }
    );

    res.send({ message: "Logo updated successfully" });
  } catch (e) {
    next(new Error("Error in updating shop logo: " + e));
  }
};

export const deleteLogo: RequestHandler<SimpleReqParam, SimpleResBody> = async (
  req,
  res,
  next
) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const shop = await ShopModel.findById(req.params.shopId).select(
      "logo -_id"
    );
    if (!shop) {
      return res.status(404).send({ message: "No shop with the given ID" });
    }

    await deleteFileFromS3(shop.logo.url);

    res.send({ message: "Image deleted successfully" });
  } catch (e) {
    next(new Error("Error in deleting image: " + e));
  }
};

export const updateBanners: RequestHandler<
  SimpleReqParam,
  SimpleResBody,
  { url: string }
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    await ShopModel.updateOne(
      { _id: req.params.shopId },
      { banners: [{ url: req.body.url }] }
    );

    res.send({ message: "Banners updated successfully" });
  } catch (e) {
    next(new Error("Error in updating banners: " + e));
  }
};

export const deleteBanners: RequestHandler<
  SimpleReqParam,
  SimpleResBody
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const shop = await ShopModel.findById(req.params.shopId).select(
      "banners -_id"
    );
    if (!shop) {
      return res.status(404).send({ message: "No shop with the given ID" });
    }

    for (const img of shop.banners) {
      await deleteFileFromS3(img.url);
    }

    res.send({ message: "Images deleted successfully" });
  } catch (e) {
    next(new Error("Error in deleting images: " + e));
  }
};

export const addPersonalId: RequestHandler<
  SimpleReqParam,
  SimpleResBody,
  PersonalId
> = async (req, res, next) => {
  try {
    let error: ValidationError | undefined;

    error = validateSimpleReqParam(req.params).error;

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    error = fromShop.validatePersonalIdData(req.body).error;
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { type, url, originalName } = req.body;

    await ShopModel.updateOne(
      { _id: req.params.shopId },
      {
        personalId: {
          type,
          url,
          originalName,
        },
      }
    );

    res.send({ message: "Personal ID added successfully" });
  } catch (e) {
    next(new Error("Error in adding personal ID: " + e));
  }
};

export const deletePersonalId: RequestHandler<
  SimpleReqParam,
  SimpleResBody
> = async (req, res, next) => {
  try {
    const { error } = validateSimpleReqParam(req.params);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const shop = await ShopModel.findById(req.params.shopId).select(
      "personalId -_id"
    );
    if (!shop) {
      return res.status(404).send({ message: "No shop with the given ID" });
    }

    await deleteFileFromS3(shop.personalId.url);

    res.send({ message: "Personal ID deleted successfully" });
  } catch (e) {
    next(new Error("Error in deleting personal ID: " + e));
  }
};

export const updatePaymentDetails: RequestHandler<
  SimpleReqParam,
  SimpleResBody,
  shopTypes.UpdatePaymentDetailsReqBody
> = async (req, res, next) => {
  try {
    let error: ValidationError | undefined;

    error = validateSimpleReqParam(req.params).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    error = fromShop.validateUpdatePaymentDetails(req.body).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    await ShopModel.updateOne(
      { _id: req.params.shopId },
      {
        $set: {
          paymentDetails: {
            bankAccountDetails: req.body.paymentDetails.bankAccountDetails,
          },
        },
      }
    );

    res.send({ message: "Payment details updated successfully" });
  } catch (err) {
    next(new Error("Error in updating payment details: " + err));
  }
};

export const updateSMLinks: RequestHandler<
  SimpleReqParam,
  SimpleResBody,
  shopTypes.UpdateSMLinksReqBody
> = async (req, res, next) => {
  try {
    let error: ValidationError | undefined;

    error = validateSimpleReqParam(req.params).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    error = fromShop.validateUpdateSMLinksData(req.body).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    await ShopModel.updateOne(
      { _id: req.params.shopId },
      {
        $set: {
          socialMediaLinks: req.body.links,
        },
      }
    );

    res.send({ message: "Social media links updated successfully." });
  } catch (err) {
    next(new Error("Error in updating social media links: " + err));
  }
};

// TODO: Use a transaction when updating shop's owners and user shops
// to ensure atomicity.
export const addOwner: RequestHandler<
  any,
  SimpleResBody,
  shopTypes.AddShopRelReqBody
> = async (req, res, next) => {
  const { error } = fromShop.validateAddShopRelReqBody(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const { userId, phone, shopId } = req.body;

  try {
    const shop = await ShopModel.findById(shopId).select("owners name");

    if (!shop)
      return res.status(404).send({ message: "No shop with the given ID" });

    const user = await User.findOne({ _id: userId }).select("name shops");

    if (!user)
      return res.status(404).send({ message: "No user with the given ID." });

    // Check if user is an owner for this shop already.
    const owner = shop.owners.find(
      (o: any) => o.userId.toHexString() === userId
    );

    if (owner)
      return res.status(400).send({
        message: `User (${phone}) is already an Owner for ${shop.name}.`,
      });

    await ShopModel.updateOne(
      { _id: shopId },
      {
        $push: {
          owners: {
            userId,
            name: user.name,
          },
        },
      }
    );

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          roles: {
            name: "Owner",
            shopId: shop._id,
          },
        },
      }
    );

    // Check if user is related to this shop already.
    const userShop = await user.shops.find(
      (s: any) => s.id.toHexString() === shopId
    );

    if (!userShop) {
      await User.updateOne(
        { _id: userId },
        { $push: { shops: { name: shop.name, id: shopId } } }
      );
    }

    res.send({
      message: `Successfully added user (${phone}) as an Owner for ${shop.name}`,
    });
  } catch (err) {
    next(new Error(`Error in adding user (${phone}) as an Owner: ${err}`));
  }
};

// TODO: Use a transaction when updating shop's owners and user shops
// to ensure atomicity.
export const addManager: RequestHandler<
  any,
  SimpleResBody,
  shopTypes.AddShopRelReqBody
> = async (req, res, next) => {
  const { error } = fromShop.validateAddShopRelReqBody(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const { userId, phone, shopId } = req.body;

  try {
    // Check if user is a manager for this shop already.
    const shop = await ShopModel.findById(shopId).select("managers name");

    if (!shop)
      return res.status(404).send({ message: "No shop with the given ID" });

    const user = await User.findOne({ _id: userId }).select("name shops");

    if (!user)
      return res.status(404).send({ message: "No user with the given ID." });

    const manager = shop.managers.find(
      (m: any) => m.userId.toHexString() === userId
    );

    if (manager)
      return res.status(400).send({
        message: `User (${phone}) is already a Manager for ${shop.name}.`,
      });

    await ShopModel.updateOne(
      { _id: shopId },
      {
        $push: {
          managers: {
            userId,
            name: user.name,
          },
        },
      }
    );

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          roles: {
            name: "Manager",
            shopId: shop._id,
          },
        },
      }
    );

    // Check if user is related to this shop already.
    const shopInfo = await user.shops.find(
      (s: any) => s.id.toHexString() === shopId
    );

    if (!shopInfo) {
      await User.updateOne(
        { _id: userId },
        { $push: { shops: { name: shop.name, id: shopId } } }
      );
    }

    res.send({
      message: `Successfully added user (${phone}) as a Manager for ${shop.name}`,
    });
  } catch (err) {
    next(new Error(`Error in adding user (${phone}) as a Manager: ${err}`));
  }
};

// TODO: Use a transaction when updating shop's owners and user shops
// to ensure atomicity.
export const addSupportStaff: RequestHandler<
  any,
  SimpleResBody,
  shopTypes.AddShopRelReqBody
> = async (req, res, next) => {
  const { error } = fromShop.validateAddShopRelReqBody(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const { userId, phone, shopId } = req.body;

  try {
    // Check if user is a supportStaff for this shop already.
    const shop = await ShopModel.findById(shopId).select("supportStaff name");

    if (!shop)
      return res.status(404).send({ message: "No shop with the given ID" });

    const user = await User.findOne({ _id: userId }).select("name shops");

    if (!user)
      return res.status(404).send({ message: "No user with the given ID." });

    const supportStaff = shop.supportStaff.find(
      (s: any) => s.userId.toHexString() === userId
    );

    if (supportStaff)
      return res.status(400).send({
        message: `User (${phone}) is already a support Staff for ${shop.name}.`,
      });

    await ShopModel.updateOne(
      { _id: shopId },
      {
        $push: {
          supportStaff: {
            userId,
            name: user.name,
          },
        },
      }
    );

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          roles: {
            name: "SupportStaff",
            shopId: shop._id,
          },
        },
      }
    );

    // Check if user is related to this shop already.
    const shopInfo = await user.shops.find(
      (s: any) => s.id.toHexString() === shopId
    );

    if (!shopInfo) {
      await User.updateOne(
        { _id: userId },
        { $push: { shops: { name: shop.name, id: shopId } } }
      );
    }

    res.send({
      message: `Successfully added user (${phone}) as a support Staff for ${shop.name}`,
    });
  } catch (err) {
    next(
      new Error(`Error in adding user (${phone}) as a support Staff: ${err}`)
    );
  }
};
