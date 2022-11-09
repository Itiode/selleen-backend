import { SaveOrderReqBody } from "./order";
import { Name, Address, Image, Shop, Role, Coords } from "./shared";

export interface User {
  _id: string;
  name: Name;
  phone: string;
  email: string;
  password: string;
  gender?: string;
  address?: Address;
  image?: Image;
  order?: SaveOrderReqBody;
  shops?: Shop[];
  roles?: Role[];
  knowOf:
    | "WhatsApp"
    | "Facebook"
    | "Instagram"
    | "Twitter"
    | "Selleen Shop Owner"
    | "Friend";
  coords?: Coords;
}

export interface BuyerSignupReqBody {
  name: Name;
  email: string;
  phone: string;
  password: string;
}

export interface SellerSignupReqBody {
  name: Name;
  email: string;
  phone: string;
  shopName: string;
  shopPhoneNumber: string[];
  shopEmail: string;
  shopAddress: Address;
  knowOf: string;
  coords: Coords;
  password: string;
}

export interface GetUserResBody {
  message: string;
  data?: {
    _id: string;
    name: Name;
    phone: string;
    email: string;
    address: Address;
    hasShop: boolean;
    shops: Shop[];
  };
}

export interface ChangePwReqBody {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateUserAddressReqBody {
  address: Address;
}

export interface UpdateUserPhoneReqBody {
  phone: string;
}

export interface DecodedUserToken {
  id: string;
  roles: Role[];
  iat: number;
  exp: number;
}
