"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBankTransferDetails = void 0;
const payments_1 = require("../../models/validators/payments");
const payments_2 = require("../../services/payments");
const getBankTransferDetails = async (req, res, next) => {
    try {
        const { error } = (0, payments_1.validateBankTransferReqData)(req.query);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const userId = req["user"].id;
        const transferData = await (0, payments_2.initiateBankTransfer)(req.query, userId);
        if ((transferData === null || transferData === void 0 ? void 0 : transferData.status) === "error") {
            res.status(500).send({
                message: "Something failed. Please try again, or use an alternative payment method (Card or Bank Account)",
            });
        }
        else {
            res.send({
                message: "Bank transfer details gotten successfully",
                data: transferData,
            });
        }
    }
    catch (e) {
        next(new Error("Error in getting bank transfer details: " + e));
    }
};
exports.getBankTransferDetails = getBankTransferDetails;
