"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageUploadURL = void 0;
const s3_1 = require("../services/s3");
const getImageUploadURL = async (req, res, next) => {
    try {
        const fileType = req.query.fileType;
        if (!fileType)
            return res.status(400).send({ message: "File type is required" });
        const data = await (0, s3_1.generateUploadURL)(fileType);
        res.send({ message: "Image upload URL gotten successfully", data });
    }
    catch (e) {
        next(new Error("Error in getting image upload URL: " + e));
    }
};
exports.getImageUploadURL = getImageUploadURL;
