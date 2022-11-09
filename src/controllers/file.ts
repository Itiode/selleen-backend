import { RequestHandler } from "express";
import { validateFileUploadQueryParams } from "../models/validators/shared";

import { generateUploadURL } from "../services/s3";
import {
  GetFileUploadURLResBody,
  GetFileUploadURLQueryParams,
} from "../types/shared";

export const getFileUploadURL: RequestHandler<
  any,
  GetFileUploadURLResBody,
  any,
  GetFileUploadURLQueryParams
> = async (req, res, next) => {
  try {
    const { error } = validateFileUploadQueryParams(req.query);
    if (error) {
      return res
        .status(400)
        .send({ message: "File type and folder name are required" });
    }

    const { fileType, folderName } = req.query;

    const data = await generateUploadURL(fileType, folderName);
    res.send({ message: "File upload URL gotten successfully", data });
  } catch (e) {
    next(new Error("Error in getting file upload URL: " + e));
  }
};
