import Joi from "joi";

import {
  SimpleReqQuery,
  SimpleReqParam,
  GetFileUploadURLQueryParams,
} from "../../types/shared";
import * as validators from "../../utils/validators";

export const validateSimpleReqQuery = (data: SimpleReqQuery) => {
  return Joi.object({
    pageSize: validators.number("Page size", { min: 10, max: 50 }),
    pageNumber: validators.number("Page size", { min: 1, max: 100 }),
    searchText: Joi.string()
      .trim()
      .max(250)
      .label("Search text")
      .allow("", null),
  }).validate(data);
};

export const validateSimpleReqParam = (data: SimpleReqParam) => {
  const obj = {};
  for (let key in data) {
    obj[`${key}`] = validators.mongoId(key);
  }

  return Joi.object(obj).validate(data);
};

export const validateFileUploadQueryParams = (
  data: GetFileUploadURLQueryParams
) => {
  return Joi.object({
    fileType: Joi.string()
      .trim()
      .valid("jpeg", "jpg", "png", "pdf")
      .label("File type"),
    folderName: Joi.string()
      .trim()
      .valid("products", "banners", "logos", "kyc-docs"),
  }).validate(data);
};
