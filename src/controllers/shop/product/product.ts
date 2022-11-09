import { RequestHandler } from "express";

import { SimpleReqQuery, SimpleResBody } from "../../../types/shared";
import * as prodTypes from "../../../types/product";
import { ValidationError } from "joi";
import {
  validateSimpleReqParam,
  validateSimpleReqQuery,
} from "../../../models/validators/shared";
import ProdModel, * as fromProd from "../../../models/product/product";
import ShopModel from "../../../models/shop";
import { checkForVariations } from "../../../utils/product";
import { GetShopProductsResBody } from "../../../types/shop/product";
import { deleteFileFromS3 } from "../../../services/s3";

export const addOrEditProduct: RequestHandler<
  { productId: string },
  SimpleResBody,
  prodTypes.AddOrEditProductReqBody
> = async (req, res, next) => {
  const { productId } = req.params;
  const editMode = productId;

  try {
    let error: ValidationError | undefined;

    if (productId) {
      error = validateSimpleReqParam(req.params).error;
      if (error)
        return res.status(400).send({ message: error.details[0].message });
    }

    error = fromProd.validateAddOrEditProdData(req.body).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const {
      name,
      description,
      price,
      numberInStock,
      shopId,
      features,
      variation,
      images,
    } = req.body;

    const tagsString = `${name}`;

    const shop = await ShopModel.findById(shopId).select(
      "name alias location approved"
    );
    if (!shop)
      return res.status(404).send({ message: "No shop with the given ID." });

    if (!shop.approved)
      return res
        .status(403)
        .send({ message: "Shop hasn't been approved yet." });

    const checkRes = await checkForVariations({ variation, shop, res });
    if (checkRes) return;

    const prodData = {
      name,
      description,
      price,
      tagsString,
      shop: { id: shop._id, name: shop.name, alias: shop.alias },
      numberInStock,
      images,
      location: shop.location,
      features,
      variation,
    };

    if (editMode) {
      const updatedProd = await ProdModel.findByIdAndUpdate(
        productId,
        {
          $set: { ...prodData, status: "InReview", approved: false },
        },
        { useFindAndModify: false }
      ).select("_id");

      if (!updatedProd)
        return res
          .status(404)
          .send({ message: "No product with the given ID" });
    } else {
      await new ProdModel({
        ...prodData,
      }).save();
    }

    res.status(201).send({
      message: `Product ${editMode ? "edited" : "added"} successfully.`,
    });
  } catch (e) {
    next(
      new Error(`Error in ${editMode ? "editing" : "adding"} product: ` + e)
    );
  }
};

export const getProducts: RequestHandler<
  { shopId: string },
  GetShopProductsResBody,
  any,
  SimpleReqQuery
> = async (req, res, next) => {
  try {
    let error: ValidationError | undefined;

    error = validateSimpleReqParam(req.params).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    error = validateSimpleReqQuery(req.query).error;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { shopId } = req.params;
    const searchText = req.query.searchText;
    const pageNumber = +req.query.pageNumber;
    const pageSize = +req.query.pageSize;

    const shop = await ShopModel.findById(shopId).select("_id");
    if (!shop)
      return res.status(404).send({ message: "No shop with the given ID" });

    let prods: any[];

    const slctProps =
      "name images price numberInStock features description status approved approval variation rating createdAt";

    if (searchText) {
      prods = await ProdModel.find({
        $text: { $search: searchText },
        "shop.id": shopId,
      })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .select(slctProps);
    } else {
      prods = await ProdModel.find({ "shop.id": shopId })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .select(slctProps)
        .sort({ _id: -1 });
    }

    res.send({ message: "Products fetched successfully", data: prods });
  } catch (e) {
    next(new Error("Error in getting products: " + e));
  }
};

export const deleteProduct: RequestHandler<
  prodTypes.DeleteProdReqParams,
  SimpleResBody
> = async (req, res, next) => {
  try {
    const { error } = fromProd.validateDeleteProdReqParams(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const prod = await ProdModel.findOneAndDelete({
      _id: req.params.productId,
      "shop.id": req.params.shopId,
    });

    if (!prod) {
      return res.status(404).send({ message: "No product with the given ID" });
    } else {
      return res.send({ message: "Product deleted successfully" });
    }
  } catch (e) {
    next(new Error("Error in deleting product: " + e));
  }
};

export const deleteProductImages: RequestHandler<
  prodTypes.DeleteS3ProdImagesReqParams,
  SimpleResBody
> = async (req, res, next) => {
  try {
    const { error } = fromProd.validateDeleteS3ProdImagesReqParams(req.params);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const prod = await ProdModel.findOne({
      _id: req.params.productId,
      "shop.id": req.params.shopId,
    }).select("images -_id");
    if (!prod) {
      return res.status(404).send({ message: "No product with the given ID" });
    }

    for (const img of prod.images) {
      await deleteFileFromS3(img.url);
    }

    res.send({ message: "Images deleted successfully" });
  } catch (e) {
    next(new Error("Error in deleting images: " + e));
  }
};
