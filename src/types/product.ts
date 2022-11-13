import mongoose from "mongoose";

import { Point, Image, Creator } from "./shared";

export type ProductApprovalStatus = "InReview" | "Approved" | "Disapproved";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: Price;
  images: Image[];
  numberInStock: number;
  tags: string[];
  tagsString: string;
  location: Point;
  shop: { id: string; name: string; alias: string };
  features: ProductFeature[];
  status: ProductApprovalStatus;
  approved: boolean;
  approval: { comment: string };
  variation: ProductVariation;
  rating?: number;
}

export interface DeleteProdReqParams {
  productId: string;
  shopId: string;
}

export interface DeleteS3ProdImagesReqParams {
  productId: string;
  shopId: string;
}

export interface ProductReview {
  creator: Creator;
  text: string;
  productId: string;
}

export interface AddProdReviewReqBody {
  text: string;
}

export interface ProductFeature {
  name: string;
  details: string;
}

export interface ProductVariation {
  color: string;
  size: string;
  weight: string;
}

export interface ProductData {
  _id: string;
  name: string;
  price: Price;
  images: Image[];
  shop: { id: string; name: string; alias: string };
}

export interface AddOrEditProductReqBody {
  name: string;
  description: string;
  price: Price;
  shopId: string;
  images: Image[];
  numberInStock: number;
  features: ProductFeature[];
  variation?: ProductVariation;
}

export interface GetProductsResBody {
  message: string;
  data?: ProductData[];
}

export interface GetProductsReqQuery {
  searchText: string;
  pageNumber: number;
  pageSize: number;
  lat?: string;
  lng?: string;
}

export interface CartProduct {
  name: string;
  productId: string;
  price: number;
  quantity: number;
  shopId: string;
}

export interface AddToCartReqBody {
  productId: string;
  quantity: number;
}

export interface AddToCartResBody {
  message: string;
  data?: CartProduct[];
}

export interface Price {
  original?: number;
  sales: number;
}

export interface GetProductResBody {
  message: string;
  data?: {
    _id: string;
    name: string;
    description: string;
    price: Price;
    images: Image[];
    shop: { id: string; name: string; alias: string };
    features: ProductFeature[];
    variation: ProductVariation;
    rating?: number;
  };
}
