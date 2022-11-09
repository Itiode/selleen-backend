"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUploadURL = void 0;
const s3_1 = require("../services/s3");
const getFileUploadURL = async (req, res, next) => {
    try {
        const fileType = req.query.fileType;
        if (!fileType)
            return res.status(400).send({ message: "File type is required" });
        const data = await (0, s3_1.generateUploadURL)(fileType);
        res.send({ message: "File upload URL gotten successfully", data });
    }
    catch (e) {
        next(new Error("Error in getting file upload URL: " + e));
    }
};
exports.getFileUploadURL = getFileUploadURL;
