import { Response } from "express";

import { ProductVariation } from "../types/product";
import ProdVModel from "../models/product/variation";

export interface VariationsCheckData {
  variation?: ProductVariation;
  shop: { _id: string };
  res: Response;
}

export async function checkForVariations(data: VariationsCheckData) {
  if (data.variation?.color) {
    const color = await ProdVModel.findOne({
      type: 'Color',
      shopId: data.shop._id,
      value: data.variation.color,
    });

    if (!color)
      return data.res.status(400).send({
        message: `'${data.variation.color}' isn't included in your product (color) variations`,
      });
  }

  if (data.variation?.size) {
    const size = await ProdVModel.findOne({
      type: 'Size',
      shopId: data.shop._id,
      value: data.variation.size,
    });
    if (!size)
      return data.res.status(400).send({
        message: `'${data.variation.size}' isn't included in your product (size) variations`,
      });
  }

  if (data.variation?.weight) {
    const weight = await ProdVModel.findOne({
      type: 'Weight',
      shopId: data.shop._id,
      value: data.variation.weight,
    });
    if (!weight)
      return data.res.status(400).send({
        message: `'${data.variation.weight}' isn't included in your product (weight) variations`,
      });
  }
}
