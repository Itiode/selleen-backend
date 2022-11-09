export interface ProductVariation {
  _id: string;
  type: "Color" | "Weight" | "Size";
  value: string;
  shopId: string;
}

export interface AddProdVariationReqBody {
  type: "Color" | "Weight" | "Size";
  value: string;
  shopId: string;
}

export interface ProdVariationReqParams {
  productVariationId: string;
  shopId: string;
}

export interface GetProdVariationsResBody {
  message: string;
  data?: ProductVariation[];
}
