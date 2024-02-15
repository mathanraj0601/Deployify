// import { Endpoint, S3 } from "aws-sdk";

// const s3 = new S3({
//   secretAccessKey: "",
//   accessKeyId: "",
//   endpoint: "",
// });

// export async function uploadFileToStorage(
//   fileName: string,
//   localFilePath: string
// ) {
//   const file = readFileSync(localFilePath);
//   const params = {
//     Bucket: "",
//     Key: fileName,
//     Body: file,
//   };
//   await s3.upload(params);
// }

const {
  BlobServiceClient,
  getBlobToLocalFile,
} = require("@azure/storage-blob");
import { BlockBlobClient } from "@azure/storage-blob";
import { readFileSync, createWriteStream, promises as fsPromises } from "fs";
import path, { dirname } from "path";

const connStr = process.env.BLOB_CONN_STR;

const CONTAINER_NAME = "deployify";

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

export async function uploadFileToStorage(
  fileName: string,
  localFilePath: string
) {
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const containerExists = await containerClient.exists();
  if (!containerExists) {
    await containerClient.create();
    console.info(`Container '${CONTAINER_NAME}' created.`);
  }
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  const fileContent = readFileSync(localFilePath);
  try {
    // Upload the file
    await blockBlobClient.upload(fileContent, fileContent.length);
    console.info(`File '${fileName}' uploaded successfully.`);
  } catch (error: any) {
    console.error(`Error uploading file '${fileName}': ${error.message}`);
    throw error;
  }
}
