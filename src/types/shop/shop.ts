import * as sharedTypes from "../shared";

export interface Shop {
  _id: string;
  shortId: string;
  name: string;
  alias: string;
  description: string;
  email: string;
  balance: number;
  logo: sharedTypes.Image;
  banners: sharedTypes.Image[];
  creator: sharedTypes.Creator;
  owners: ShopRelation[];
  managers: ShopRelation[];
  supportStaff: ShopRelation[];
  contactLines: string[];
  tags: string[];
  address: sharedTypes.Address;
  location: sharedTypes.Point;
  rating: number;
  socialMediaLinks: sharedTypes.SocialMediaLink[];
  personalId: sharedTypes.PersonalId;
  approved: boolean;
  approval: { comment: string };
  status: "InReview" | "Approved" | "Suspended";
  paymentDetails: PaymentDetails;
  createdAt: string;
}

export interface CreateShopReqBody {
  name: string;
  alias: string;
  description: string;
  email: string;
  address: sharedTypes.Address;
  contactLines: string[];
  coords: sharedTypes.Coords;
}

export interface GetShopByIdResBody {
  message: string;
  data?: Shop;
}

export interface ShopByAlias {
  _id: string;
  name: string;
  alias: string;
  description: string;
  image: sharedTypes.Image;
  contactLines: string[];
  address: sharedTypes.Address;
  rating: number;
  socialMediaLinks: sharedTypes.SocialMediaLink[];
  createdAt: string;
}

export interface GetShopByAliasReqParam {
  alias: string;
}

export interface GetShopByAliasResBody {
  message: string;
  data?: ShopByAlias;
}

export interface UpdateShopReqBody {
  alias: string[];
  contactLines: string[];
  address: sharedTypes.Address;
  description: string;
}

export interface ShopRelation {
  name: sharedTypes.Name;
  userId: string;
}

export interface AddShopRelReqBody {
  phone: string;
  userId: string;
  shopId: string;
}

export interface UpdateSMLinksReqBody {
  links: sharedTypes.SocialMediaLink[];
}

export interface PaymentDetails {
  bankAccountDetails: {
    bankName: string;
    accountName: string;
    accountType: string;
    accountNumber: string;
  };
}

export interface UpdatePaymentDetailsReqBody {
  paymentDetails: PaymentDetails;
}