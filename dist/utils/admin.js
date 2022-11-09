"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAdminToken = exports.createAdminAction = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const admin_action_1 = require("../models/admin/admin-action");
const constants_1 = require("./constants");
async function createAdminAction(data) {
    const actionData = {
        initiator: { adminId: data.initiator.adminId, name: data.initiator.name },
        type: getActionType(data.actionCategory, data.actionName),
        phrase: getActionPhrase(data.actionCategory, data.actionName),
        entityId: data.entityId,
        comment: data.comment,
    };
    if (data.actionCategory === "Shop") {
        const AdminShopActionModel = (0, admin_action_1.getModel)("Shop");
        return new AdminShopActionModel(actionData).save({ session: data.session });
    }
    else if (data.actionCategory === "Product") {
        const AdminProdActionModel = (0, admin_action_1.getModel)("Product");
        return new AdminProdActionModel(actionData).save({ session: data.session });
    }
}
exports.createAdminAction = createAdminAction;
function getActionType(actionCategory, actionName) {
    if (actionCategory === "Shop") {
        return getShopActionType(actionName);
    }
    else if (actionCategory === "Product") {
        return getProdActionType(actionName);
    }
}
function getActionPhrase(actionCategory, actionName) {
    if (actionCategory === "Shop") {
        return getShopActionPhrase(actionName);
    }
    else if (actionCategory === "Product") {
        return getProdActionPhrase(actionName);
    }
}
function getShopActionType(name) {
    let actionType = "";
    if (name === "Approved")
        actionType = constants_1.adminShopActionTypes.approvedShop;
    else if (name === "Disapproved")
        actionType = constants_1.adminShopActionTypes.disapprovedShop;
    else if (name === "Suspended")
        actionType = constants_1.adminShopActionTypes.suspendedShop;
    return actionType;
}
function getProdActionType(name) {
    let actionType = "";
    if (name === "Approved")
        actionType = constants_1.adminProductActionTypes.approvedProduct;
    else if (name === "Disapproved")
        actionType = constants_1.adminProductActionTypes.disapprovedProduct;
    return actionType;
}
function getShopActionPhrase(name) {
    let actionPhrase = "";
    if (name === "Approved")
        actionPhrase = constants_1.adminShopActionPhrases.approvedShop;
    else if (name === "Disapproved")
        actionPhrase = constants_1.adminShopActionPhrases.disapprovedShop;
    else if (name === "Suspended")
        actionPhrase = constants_1.adminShopActionPhrases.suspendedShop;
    return actionPhrase;
}
function getProdActionPhrase(name) {
    let actionPhrase = "";
    if (name === "Approved")
        actionPhrase = constants_1.adminProductActionPhrases.approvedProduct;
    else if (name === "Disapproved")
        actionPhrase = constants_1.adminProductActionPhrases.disapprovedProduct;
    return actionPhrase;
}
function decodeAdminToken(token) {
    const decoded = jwt.verify(token, config_1.default.get("jwtAuthPrivateKey"));
    return {
        id: decoded._id,
        permissions: decoded.permissions,
        iat: decoded.iat,
        exp: decoded.exp,
    };
}
exports.decodeAdminToken = decodeAdminToken;
