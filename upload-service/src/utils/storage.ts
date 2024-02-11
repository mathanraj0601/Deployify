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

// export async function downloadFromStorage(dirName: string) {
//   const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
//   const containerExists = await containerClient.exists();
//   if (!containerExists) {
//     console.error("Container not found");
//     return;
//   }
//   const blobIterator = containerClient.listBlobsFlat({ prefix: dirName });
//   // console.log(blobIterator);
//   for await (const blob of blobIterator) {
//     const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
//     const filePath = path.join(__dirname, "..", "blob", blob.name);

//     await fsPromises.mkdir(dirname(filePath), { recursive: true });

//     console.log(filePath, "file path to local");
//     try {
//       const response = await blockBlobClient.download();
//       const writeStream = createWriteStream(filePath);
//       await new Promise<void>((resolve, reject) => {
//         response
//           .readableStreamBody!.pipe(writeStream)
//           .on("finish", resolve)
//           .on("error", reject);
//       });
//       console.log(
//         `File '${blob.name}' downloaded successfully to '${filePath}'.`
//       );
//     } catch (error: any) {
//       console.error(`Error downloading file '${blob.name}': ${error.message}`);
//     }
//     console.log(blockBlobClient);
//   }
// }
