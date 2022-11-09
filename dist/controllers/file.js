"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUploadURL = void 0;
const shared_1 = require("../models/validators/shared");
const s3_1 = require("../services/s3");
const getFileUploadURL = async (req, res, next) => {
    try {
        const { error } = (0, shared_1.validateFileUploadQueryParams)(req.query);
        if (error) {
            return res
                .status(400)
                .send({ message: "File type and folder name are required" });
        }
        const { fileType, folderName } = req.query;
        const data = await (0, s3_1.generateUploadURL)(fileType, folderName);
        res.send({ message: "File upload URL gotten successfully", data });
    }
    catch (e) {
        next(new Error("Error in getting file upload URL: " + e));
    }
};
exports.getFileUploadURL = getFileUploadURL;
