import { Name } from "../shared";

export interface AdminAction {
  _id: string;
  type: string;
  phrase: string;
  initiator: AdminActionInitiator;
  entityId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminActionInitiator {
  adminId: string;
  name: Name;
}

export type AdminActionCategory = "User" | "Product" | "Shop";
