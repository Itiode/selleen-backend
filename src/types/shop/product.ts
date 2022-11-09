import {
  Price,
  ProductApprovalStatus,
  ProductFeature,
  ProductVariation,
} from "../product";
import { Image } from "../shared";

export interface GetShopProductsReqQuery {
  searchText: string;
  pageNumber: number;
  pageSize: number;
}

export interface GetShopProductsResBody {
  message: string;
  data?: {
    _id: string;
    name: string;
    description: string;
    price: Price;
    images: Image[];
    numberInStock: number;
    features: ProductFeature[];
    status: ProductApprovalStatus;
    approved: boolean;
    approval: { comment: string };
    variation: ProductVariation;
    rating?: number;
    createdAt: string;
  }[];
}
