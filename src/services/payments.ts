import config from "config";
const Flutterwave = require("flutterwave-node-v3");
import { nanoid } from "nanoid";

import {
  BankTransferReqData,
  BankTransferResData,
  TransferReqData,
  TransferResData,
} from "../types/payments";

const flw = new Flutterwave(
  config.get("flutterwavePublicKey"),
  config.get("flutterwaveSecretKey")
);

function getTransferRef() {
  return `SLN_TXREF_${nanoid()}`;
}

export async function initiateBankTransfer(
  data: BankTransferReqData,
  userId: string
): Promise<BankTransferResData> {
  try {
    const details = {
      tx_ref: `${getTransferRef()}_USER_ID=${userId}`,
      amount: data.amount,
      email: data.email,
      currency: "NGN",
    };
    return await flw.Charge.bank_transfer(details);
  } catch (e) {
    return { status: "error", message: "Failed" };
  }
}

export async function initiateTransfer(
  data: TransferReqData
): Promise<TransferResData> {
  try {
    const details = {
      account_bank: data.bankName,
      account_number: data.accountNumber,
      amount: data.amount,
      currency: "NGN",
      narration: "Settlement for processed orders (Selleen).",
      reference: `${getTransferRef()}`,
    };

    return await flw.Transfer.initiate(details);
  } catch (e) {
    return { status: "error", message: "Failed" };
  }
}
