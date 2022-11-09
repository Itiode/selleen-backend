import { Shop } from "../shop/shop";

export interface GetShopsResBody {
  message: string;
  data?: Shop[];
}

export interface ApproveShopReqBody {
  action: "Approved" | "Disapproved" | "Suspended";
  comment: string;
}
