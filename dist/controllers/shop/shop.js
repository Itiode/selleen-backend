"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSupportStaff = exports.addManager = exports.addOwner = exports.updateSMLinks = exports.updatePaymentDetails = exports.deletePersonalId = exports.addPersonalId = exports.deleteBanners = exports.updateBanners = exports.deleteLogo = exports.updateLogo = exports.updateShop = exports.getShopByAlias = exports.getShopById = void 0;
const shop_1 = __importStar(require("../../models/shop")), fromShop = shop_1;
const user_1 = __importDefault(require("../../models/user"));
const shared_1 = require("../../models/validators/shared");
const s3_1 = require("../../services/s3");
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
const getShopById = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const shopId = req.params.shopId;
        const shop = await shop_1.default.findById(shopId).select("-__v -createdAt -updatedAt -balance");
        if (!shop)
            return res.status(404).send({
                message: "No shop found",
            });
        res.send({
            message: "Shop gotten successfully",
            data: shop,
        });
    }
    catch (err) {
        next(new Error("Error in getting shop: " + err));
    }
};
exports.getShopById = getShopById;
const getShopByAlias = async (req, res, next) => {
    try {
        const { error } = fromShop.validateShopAlias(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const alias = req.params.alias;
        const shop = await shop_1.default.findOne({ alias }).select("name alias description logo banners contactLines address rating approved socialMediaLinks createdAt");
        if (!shop)
            return res.status(404).send({
                message: "No shop found",
            });
        res.send({
            message: "Shop gotten successfully",
            data: shop,
        });
    }
    catch (err) {
        next(new Error("Error in getting shop: " + err));
    }
};
exports.getShopByAlias = getShopByAlias;
const updateShop = async (req, res, next) => {
    try {
        let error;
        error = (0, shared_1.validateSimpleReqParam)(req.params).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        error = fromShop.validateUpdateShopData(req.body).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { alias, address, contactLines, description } = req.body;
        const { shopId } = req.params;
        const fetchedShop = await shop_1.default.findById(shopId);
        if (!fetchedShop)
            return res.status(404).send({ message: "No shop found." });
        await shop_1.default.updateOne({ _id: shopId }, {
            $set: {
                alias,
                address,
                contactLines,
                description,
            },
        });
        res.send({ message: "Shop updated successfully" });
    }
    catch (err) {
        next(new Error("Error in updating shop: " + err));
    }
};
exports.updateShop = updateShop;
const updateLogo = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        await shop_1.default.updateOne({ _id: req.params.shopId }, { logo: { url: req.body.url } });
        res.send({ message: "Logo updated successfully" });
    }
    catch (e) {
        next(new Error("Error in updating shop logo: " + e));
    }
};
exports.updateLogo = updateLogo;
const deleteLogo = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const shop = await shop_1.default.findById(req.params.shopId).select("logo -_id");
        if (!shop) {
            return res.status(404).send({ message: "No shop with the given ID" });
        }
        await (0, s3_1.deleteFileFromS3)(shop.logo.url);
        res.send({ message: "Image deleted successfully" });
    }
    catch (e) {
        next(new Error("Error in deleting image: " + e));
    }
};
exports.deleteLogo = deleteLogo;
const updateBanners = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        await shop_1.default.updateOne({ _id: req.params.shopId }, { banners: [{ url: req.body.url }] });
        res.send({ message: "Banners updated successfully" });
    }
    catch (e) {
        next(new Error("Error in updating banners: " + e));
    }
};
exports.updateBanners = updateBanners;
const deleteBanners = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const shop = await shop_1.default.findById(req.params.shopId).select("banners -_id");
        if (!shop) {
            return res.status(404).send({ message: "No shop with the given ID" });
        }
        for (const img of shop.banners) {
            await (0, s3_1.deleteFileFromS3)(img.url);
        }
        res.send({ message: "Images deleted successfully" });
    }
    catch (e) {
        next(new Error("Error in deleting images: " + e));
    }
};
exports.deleteBanners = deleteBanners;
const addPersonalId = async (req, res, next) => {
    try {
        let error;
        error = (0, shared_1.validateSimpleReqParam)(req.params).error;
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        error = fromShop.validatePersonalIdData(req.body).error;
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const { type, url, originalName } = req.body;
        await shop_1.default.updateOne({ _id: req.params.shopId }, {
            personalId: {
                type,
                url,
                originalName,
            },
        });
        res.send({ message: "Personal ID added successfully" });
    }
    catch (e) {
        next(new Error("Error in adding personal ID: " + e));
    }
};
exports.addPersonalId = addPersonalId;
const deletePersonalId = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const shop = await shop_1.default.findById(req.params.shopId).select("personalId -_id");
        if (!shop) {
            return res.status(404).send({ message: "No shop with the given ID" });
        }
        await (0, s3_1.deleteFileFromS3)(shop.personalId.url);
        res.send({ message: "Personal ID deleted successfully" });
    }
    catch (e) {
        next(new Error("Error in deleting personal ID: " + e));
    }
};
exports.deletePersonalId = deletePersonalId;
const updatePaymentDetails = async (req, res, next) => {
    try {
        let error;
        error = (0, shared_1.validateSimpleReqParam)(req.params).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        error = fromShop.validateUpdatePaymentDetails(req.body).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        await shop_1.default.updateOne({ _id: req.params.shopId }, {
            $set: {
                paymentDetails: {
                    bankAccountDetails: req.body.paymentDetails.bankAccountDetails,
                },
            },
        });
        res.send({ message: "Payment details updated successfully" });
    }
    catch (err) {
        next(new Error("Error in updating payment details: " + err));
    }
};
exports.updatePaymentDetails = updatePaymentDetails;
const updateSMLinks = async (req, res, next) => {
    try {
        let error;
        error = (0, shared_1.validateSimpleReqParam)(req.params).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        error = fromShop.validateUpdateSMLinksData(req.body).error;
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        await shop_1.default.updateOne({ _id: req.params.shopId }, {
            $set: {
                socialMediaLinks: req.body.links,
            },
        });
        res.send({ message: "Social media links updated successfully." });
    }
    catch (err) {
        next(new Error("Error in updating social media links: " + err));
    }
};
exports.updateSMLinks = updateSMLinks;
// TODO: Use a transaction when updating shop's owners and user shops
// to ensure atomicity.
const addOwner = async (req, res, next) => {
    const { error } = fromShop.validateAddShopRelReqBody(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const { userId, phone, shopId } = req.body;
    try {
        const shop = await shop_1.default.findById(shopId).select("owners name");
        if (!shop)
            return res.status(404).send({ message: "No shop with the given ID" });
        const user = await user_1.default.findOne({ _id: userId }).select("name shops");
        if (!user)
            return res.status(404).send({ message: "No user with the given ID." });
        // Check if user is an owner for this shop already.
        const owner = shop.owners.find((o) => o.userId.toHexString() === userId);
        if (owner)
            return res.status(400).send({
                message: `User (${phone}) is already an Owner for ${shop.name}.`,
            });
        await shop_1.default.updateOne({ _id: shopId }, {
            $push: {
                owners: {
                    userId,
                    name: user.name,
                },
            },
        });
        await user_1.default.updateOne({ _id: userId }, {
            $push: {
                roles: {
                    name: "Owner",
                    shopId: shop._id,
                },
            },
        });
        // Check if user is related to this shop already.
        const userShop = await user.shops.find((s) => s.id.toHexString() === shopId);
        if (!userShop) {
            await user_1.default.updateOne({ _id: userId }, { $push: { shops: { name: shop.name, id: shopId } } });
        }
        res.send({
            message: `Successfully added user (${phone}) as an Owner for ${shop.name}`,
        });
    }
    catch (err) {
        next(new Error(`Error in adding user (${phone}) as an Owner: ${err}`));
    }
};
exports.addOwner = addOwner;
// TODO: Use a transaction when updating shop's owners and user shops
// to ensure atomicity.
const addManager = async (req, res, next) => {
    const { error } = fromShop.validateAddShopRelReqBody(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const { userId, phone, shopId } = req.body;
    try {
        // Check if user is a manager for this shop already.
        const shop = await shop_1.default.findById(shopId).select("managers name");
        if (!shop)
            return res.status(404).send({ message: "No shop with the given ID" });
        const user = await user_1.default.findOne({ _id: userId }).select("name shops");
        if (!user)
            return res.status(404).send({ message: "No user with the given ID." });
        const manager = shop.managers.find((m) => m.userId.toHexString() === userId);
        if (manager)
            return res.status(400).send({
                message: `User (${phone}) is already a Manager for ${shop.name}.`,
            });
        await shop_1.default.updateOne({ _id: shopId }, {
            $push: {
                managers: {
                    userId,
                    name: user.name,
                },
            },
        });
        await user_1.default.updateOne({ _id: userId }, {
            $push: {
                roles: {
                    name: "Manager",
                    shopId: shop._id,
                },
            },
        });
        // Check if user is related to this shop already.
        const shopInfo = await user.shops.find((s) => s.id.toHexString() === shopId);
        if (!shopInfo) {
            await user_1.default.updateOne({ _id: userId }, { $push: { shops: { name: shop.name, id: shopId } } });
        }
        res.send({
            message: `Successfully added user (${phone}) as a Manager for ${shop.name}`,
        });
    }
    catch (err) {
        next(new Error(`Error in adding user (${phone}) as a Manager: ${err}`));
    }
};
exports.addManager = addManager;
// TODO: Use a transaction when updating shop's owners and user shops
// to ensure atomicity.
const addSupportStaff = async (req, res, next) => {
    const { error } = fromShop.validateAddShopRelReqBody(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const { userId, phone, shopId } = req.body;
    try {
        // Check if user is a supportStaff for this shop already.
        const shop = await shop_1.default.findById(shopId).select("supportStaff name");
        if (!shop)
            return res.status(404).send({ message: "No shop with the given ID" });
        const user = await user_1.default.findOne({ _id: userId }).select("name shops");
        if (!user)
            return res.status(404).send({ message: "No user with the given ID." });
        const supportStaff = shop.supportStaff.find((s) => s.userId.toHexString() === userId);
        if (supportStaff)
            return res.status(400).send({
                message: `User (${phone}) is already a support Staff for ${shop.name}.`,
            });
        await shop_1.default.updateOne({ _id: shopId }, {
            $push: {
                supportStaff: {
                    userId,
                    name: user.name,
                },
            },
        });
        await user_1.default.updateOne({ _id: userId }, {
            $push: {
                roles: {
                    name: "SupportStaff",
                    shopId: shop._id,
                },
            },
        });
        // Check if user is related to this shop already.
        const shopInfo = await user.shops.find((s) => s.id.toHexString() === shopId);
        if (!shopInfo) {
            await user_1.default.updateOne({ _id: userId }, { $push: { shops: { name: shop.name, id: shopId } } });
        }
        res.send({
            message: `Successfully added user (${phone}) as a support Staff for ${shop.name}`,
        });
    }
    catch (err) {
        next(new Error(`Error in adding user (${phone}) as a support Staff: ${err}`));
    }
};
exports.addSupportStaff = addSupportStaff;
