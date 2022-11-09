import Joi from "joi";

import * as adminShopTypes from "../../../types/admin/shop";
import * as validators from "../../../utils/validators";

export function validateApproveShopData(
  data: adminShopTypes.ApproveShopReqBody
) {
  const schema = Joi.object({
    action: Joi.string()
      .trim()
      .valid("Approved", "Disapproved", "Suspended")
      .required()
      .label("Action"),
    comment: validators.string("Comment", { max: 500 }),
  });

  return schema.validate(data);
}
