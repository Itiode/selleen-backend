import { CartProduct } from "./product";
import { Name, Coords, Address } from "./shared";

export type OrderStatus = "Processed" | "En Route" | "Delivered";
export type DeliveryMedium = "Pickup" | "Rider" | "Driver";

export interface Order {
  _id: string;
  shortId: string;
  shop: Shop;
  user: User;
  delivery: Delivery;
  status: OrderStatus;
  products: Product[];
  totalAmount: number;
  note: string;
  updatedAt: string;
  createdAt: string;
}

export interface Delivery {
  medium: DeliveryMedium;
  agent?: DeliveryAgent;
}

export interface DeliveryAgent {
  name: string;
  phone: string;
}

export interface User {
  id: string;
  name: Name;
  phone: string;
  address: Address;
  coords: Coords;
}

export interface Shop {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  shopId: string;
  price: number;
  quantity: number;
  amount: number;
}

export interface ShopsOrder {
  [key: string]: {
    products: Product[];
    shop: { id: string; name: string };
    totalAmount: number;
    shortId: string;
  };
}

export interface SaveOrderReqBody {
  name: Name;
  phone: string;
  address: Address;
  note?: string;
  coords: Coords;
  products: CartProduct[];
  delivery: {
    medium: DeliveryMedium;
  };
}

export interface GetOrdersResBody {
  message: string;
  data?: {
    _id: string;
    shortId: string;
    shop: Shop;
    user: {
      _id: string;
      name: Name;
      phone: string;
      address: Address;
    };
    delivery: { medium: DeliveryMedium };
    status: OrderStatus;
    products: Product[];
    note: string;
    totalAmount: number;
    createdAt: string;
  }[];
}

export interface GetOrderCountResBody {
  message: string;
  data?: number;
}

export interface UpdateStatusReqBody {
  status: OrderStatus;
}
