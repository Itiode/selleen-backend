"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromS3 = exports.generateUploadURL = void 0;
const config_1 = __importDefault(require("config"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const nanoid_1 = require("nanoid");
const bucketName = config_1.default.get("awsBucketName");
const region = config_1.default.get("awsBucketRegion");
const accessKeyId = config_1.default.get("awsBucketAccessKeyId");
const secretAccessKey = config_1.default.get("awsBucketSecretAccessKey");
const s3 = new aws_sdk_1.default.S3({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region,
    signatureVersion: "v4",
});
async function generateUploadURL(fileType, folderName) {
    const imgName = `SLN_${(0, nanoid_1.nanoid)()}.${fileType}`;
    const key = `${folderName}/${imgName}`;
    const params = {
        Bucket: bucketName,
        Key: key,
        Expires: 60,
    };
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    return { url: uploadURL, key };
}
exports.generateUploadURL = generateUploadURL;
function deleteFileFromS3(key) {
    const params = {
        Key: key,
        Bucket: bucketName,
    };
    return s3.deleteObject(params).promise();
}
exports.deleteFileFromS3 = deleteFileFromS3;
