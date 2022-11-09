import Joi from "joi";

import * as validators from "../../utils/validators";
import { BankTransferReqData } from "../../types/payments";

export const validateBankTransferReqData = (data: BankTransferReqData) => {
  return Joi.object({
    amount: validators.number("Transfer amount", { min: 100, max: 1000000 }),
    email: validators.email("Email"),
  }).validate(data);
};
