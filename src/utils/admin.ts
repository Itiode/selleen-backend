import * as jwt from "jsonwebtoken";
import config from "config";

import { getModel } from "../models/admin/admin-action";
import * as adminActionTypes from "../types/admin/admin-action";
import {
  adminShopActionTypes,
  adminShopActionPhrases,
  adminProductActionTypes,
  adminProductActionPhrases,
} from "./constants";
import { DecodedAdminToken } from "../types/admin/admin";

interface CreateAdminActionData {
  initiator: adminActionTypes.AdminActionInitiator;
  actionName: string;
  actionCategory: adminActionTypes.AdminActionCategory;
  entityId: string;
  comment: string;
  session: any;
}

export async function createAdminAction(data: CreateAdminActionData) {
  const actionData = {
    initiator: { adminId: data.initiator.adminId, name: data.initiator.name },
    type: getActionType(data.actionCategory, data.actionName),
    phrase: getActionPhrase(data.actionCategory, data.actionName),
    entityId: data.entityId,
    comment: data.comment,
  };

  if (data.actionCategory === "Shop") {
    const AdminShopActionModel = getModel("Shop");
    return new AdminShopActionModel(actionData).save({ session: data.session });
  } else if (data.actionCategory === "Product") {
    const AdminProdActionModel = getModel("Product");
    return new AdminProdActionModel(actionData).save({ session: data.session });
  }
}

function getActionType(
  actionCategory: adminActionTypes.AdminActionCategory,
  actionName: string
) {
  if (actionCategory === "Shop") {
    return getShopActionType(actionName);
  } else if (actionCategory === "Product") {
    return getProdActionType(actionName);
  }
}

function getActionPhrase(
  actionCategory: adminActionTypes.AdminActionCategory,
  actionName: string
) {
  if (actionCategory === "Shop") {
    return getShopActionPhrase(actionName);
  } else if (actionCategory === "Product") {
    return getProdActionPhrase(actionName);
  }
}

function getShopActionType(name: string): string {
  let actionType = "";
  if (name === "Approved") actionType = adminShopActionTypes.approvedShop;
  else if (name === "Disapproved")
    actionType = adminShopActionTypes.disapprovedShop;
  else if (name === "Suspended")
    actionType = adminShopActionTypes.suspendedShop;

  return actionType;
}

function getProdActionType(name: string): string {
  let actionType = "";
  if (name === "Approved") actionType = adminProductActionTypes.approvedProduct;
  else if (name === "Disapproved")
    actionType = adminProductActionTypes.disapprovedProduct;

  return actionType;
}

function getShopActionPhrase(name: string): string {
  let actionPhrase = "";
  if (name === "Approved") actionPhrase = adminShopActionPhrases.approvedShop;
  else if (name === "Disapproved")
    actionPhrase = adminShopActionPhrases.disapprovedShop;
  else if (name === "Suspended")
    actionPhrase = adminShopActionPhrases.suspendedShop;

  return actionPhrase;
}

function getProdActionPhrase(name: string): string {
  let actionPhrase = "";
  if (name === "Approved")
    actionPhrase = adminProductActionPhrases.approvedProduct;
  else if (name === "Disapproved")
    actionPhrase = adminProductActionPhrases.disapprovedProduct;

  return actionPhrase;
}

export function decodeAdminToken(token: string): DecodedAdminToken {
  const decoded: any = jwt.verify(token, config.get("jwtAuthPrivateKey"));
  return {
    id: decoded._id,
    permissions: decoded.permissions,
    iat: decoded.iat,
    exp: decoded.exp,
  };
}
