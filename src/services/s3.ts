import config from "config";
import aws from "aws-sdk";
import { nanoid } from "nanoid";

import { S3FolderName } from "../types/shared";

const bucketName: string = config.get("awsBucketName");
const region: string = config.get("awsBucketRegion");
const accessKeyId: string = config.get("awsBucketAccessKeyId");
const secretAccessKey: string = config.get("awsBucketSecretAccessKey");

const s3 = new aws.S3({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
  signatureVersion: "v4",
});

export async function generateUploadURL(
  fileType: string,
  folderName: S3FolderName
) {
  const imgName = `SLN_${nanoid()}.${fileType}`;
  const key = `${folderName}/${imgName}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return { url: uploadURL, key };
}

export function deleteFileFromS3(key: string) {
  const params: aws.S3.DeleteObjectRequest = {
    Key: key,
    Bucket: bucketName,
  };

  return s3.deleteObject(params).promise();
}
