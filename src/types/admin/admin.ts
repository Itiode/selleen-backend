import * as sharedTypes from "../shared";

export interface Admin {
  _id: string;
  name: sharedTypes.Name;
  email: string;
  phone: string;
  address: sharedTypes.Address;
  password: string;
  permissions: string[];
}

export interface SignupReqBody {
  name: sharedTypes.Name;
  email: string;
  phone: string;
  address: sharedTypes.Address;
  password: string;
}

export interface GetAdminResBody {
  message: string;
  data?: {
    _id: string;
    name: sharedTypes.Name;
    email: string;
    phone: string;
    address: sharedTypes.Address;
    password: string;
    permissions: string[];
  };
}

export interface DecodedAdminToken {
  id: string;
  permissions: string[];
  iat: number;
  exp: number;
}
