"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selleenCharge = exports.paymentEventTypes = exports.orderStatuses = exports.adminProductActionPhrases = exports.adminProductActionTypes = exports.adminShopActionPhrases = exports.adminShopActionTypes = void 0;
exports.adminShopActionTypes = {
    approvedShop: "ApprovedShop",
    disapprovedShop: "DisapprovedShop",
    suspendedShop: "SuspendedShop",
};
exports.adminShopActionPhrases = {
    approvedShop: "approved shop",
    disapprovedShop: "disapproved shop",
    suspendedShop: "suspended shop",
};
exports.adminProductActionTypes = {
    approvedProduct: "ApprovedProduct",
    disapprovedProduct: "DisapprovedProduct",
};
exports.adminProductActionPhrases = {
    approvedProduct: "approved product",
    disapprovedProduct: "disapproved product",
};
exports.orderStatuses = {
    processing: "Processing",
    processed: "Processed",
    enRoute: "En Route",
    delivered: "Delivered",
};
exports.paymentEventTypes = {
    bankTransfer: "BANK_TRANSFER_TRANSACTION",
};
// In percentage.
exports.selleenCharge = { order: 3, delivery: 10 };
