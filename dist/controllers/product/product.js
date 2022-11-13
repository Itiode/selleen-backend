"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShopProducts = exports.getProducts = exports.getProduct = void 0;
const product_1 = __importDefault(require("../../models/product/product"));
const shared_1 = require("../../models/validators/shared");
const getProduct = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const prod = await product_1.default.findOne({
            _id: req.params.productId,
            approved: true,
        }).select("name description price images shop features variation rating");
        if (!prod)
            return res.status(404).send({ message: "No product found" });
        res.send({ message: "Product fetched successfully", data: prod });
    }
    catch (e) {
        next(new Error("Error in getting product: " + e));
    }
};
exports.getProduct = getProduct;
const getProducts = async (req, res, next) => {
    try {
        const searchText = req.query.searchText;
        const pageNumber = +req.query.pageNumber;
        const pageSize = +req.query.pageSize;
        const lat = req.query?.lat;
        const lng = req.query?.lng;
        let prods = [];
        if (searchText) {
            prods = await product_1.default.find({
                $text: { $search: searchText },
                approved: true,
            })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .select("name price shop images");
        }
        else if (!lat || !lng) {
            prods = await product_1.default.find({
                approved: true,
            })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .select("name price shop images");
        }
        else {
            prods = await product_1.default.find({
                approved: true,
                location: {
                    $near: { $geometry: { type: "Point", coordinates: [lng, lat] } },
                },
            })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .select("name price shop images");
        }
        res.send({
            message: "Products fetched successfully",
            data: prods,
        });
    }
    catch (e) {
        next(new Error("Error in getting products: " + e));
    }
};
exports.getProducts = getProducts;
const getShopProducts = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateSimpleReqParam)(req.params);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const shopId = req.params.shopId;
        const searchText = req.query.searchText;
        const pageNumber = +req.query.pageNumber;
        const pageSize = +req.query.pageSize;
        const lat = req.query?.lat;
        const lng = req.query?.lng;
        let prods = [];
        if (searchText) {
            prods = await product_1.default.find({
                $text: { $search: searchText },
                approved: true,
                "shop.id": shopId,
            })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .select("name price shop images");
        }
        else {
            prods = await product_1.default.find({ "shop.id": shopId, approved: true })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .select("name price shop images");
        }
        res.send({
            message: "Shop products fetched successfully",
            data: prods,
        });
    }
    catch (e) {
        next(new Error("Error in getting shop products: " + e));
    }
};
exports.getShopProducts = getShopProducts;
// export const addToCart: RequestHandler<
//   any,
//   prodTypes.AddToCartResBody,
//   prodTypes.AddToCartReqBody
// > = async (req, res, next) => {
//   try {
//     const { error } = fromProd.validateAddToCartData(req.body);
//     if (error)
//       return res.status(400).send({ message: error.details[0].message });
//     const { productId, quantity } = req.body;
//     const userId = req["user"].id;
//     const fetchedUser = await UserModel.findById(userId).select("_id");
//     if (!fetchedUser)
//       return res.status(404).send({ message: "No user with the given ID" });
//     const prod = await ProdModel.findById(productId).select(
//       "name price shop.id numberInStock"
//     );
//     if (!prod)
//       return res.status(404).send({ message: "No product with the given ID." });
//     // Check if product is in cart already.
//     const cart = await UserModel.findOne({
//       _id: userId,
//       "cart.productId": productId,
//     }).select("cart -_id");
//     if (cart) {
//       const updateRes = await UserModel.findOneAndUpdate(
//         { _id: userId, "cart.productId": productId },
//         { $inc: { "cart.$.quantity": quantity } },
//         { new: true, useFindAndModify: false }
//       ).select("cart -_id");
//       return res.send({
//         message: "Added product to cart successfully",
//         data: updateRes.cart,
//       });
//     }
//     const cartProduct = {
//       name: prod.name,
//       productId: prod._id,
//       price: prod.price.sales,
//       quantity,
//       shopId: prod.shop.id,
//     };
//     const updateRes = await UserModel.findOneAndUpdate(
//       { _id: userId },
//       { $push: { cart: cartProduct } },
//       { new: true, useFindAndModify: false }
//     ).select("cart -_id");
//     res.send({
//       message: "Added product to cart successfully",
//       data: updateRes.cart,
//     });
//   } catch (e) {
//     next(new Error("Error in adding product to cart: " + e));
//   }
// };
