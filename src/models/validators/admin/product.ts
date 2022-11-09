import Joi from "joi";

import * as adminProdTypes from "../../../types/admin/product";
import * as validators from "../../../utils/validators";

export function validateApproveProdData(
  data: adminProdTypes.ApproveProductReqBody
) {
  const schema = Joi.object({
    action: Joi.string()
      .trim()
      .valid("Approved", "Disapproved")
      .required()
      .label("Action"),
    comment: validators.string("Comment", { max: 500 }),
  });

  return schema.validate(data);
}
