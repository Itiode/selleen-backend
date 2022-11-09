import { RequestHandler } from "express";

import { validateBankTransferReqData } from "../../models/validators/payments";
import { initiateBankTransfer } from "../../services/payments";
import { BankTransferReqData, BankTransferResBody } from "../../types/payments";

export const getBankTransferDetails: RequestHandler<
  any,
  BankTransferResBody,
  any,
  BankTransferReqData
> = async (req, res, next) => {
  try {
    const { error } = validateBankTransferReqData(req.query);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const userId = req["user"].id;

    const transferData = await initiateBankTransfer(req.query, userId);
    if (transferData?.status === "error") {
      res.status(500).send({
        message:
          "Something failed. Please try again, or use an alternative payment method (Card or Bank Account)",
      });
    } else {
      res.send({
        message: "Bank transfer details gotten successfully",
        data: transferData,
      });
    }
  } catch (e) {
    next(new Error("Error in getting bank transfer details: " + e));
  }
};
