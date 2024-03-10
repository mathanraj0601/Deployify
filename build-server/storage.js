const { BlobServiceClient } = require("@azure/storage-blob");
const CONTAINER_NAME = "deployify";
const connStr = process.env.BLOB_CONN_STR;
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const { readFileSync } = require("fs");
const mime = require("mime-types");

async function uploadFileToStorage(fileName, localFilePath) {
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
    await blockBlobClient.upload(fileContent, fileContent.length, {
      blobHTTPHeaders: {
        blobContentType: mime.lookup(localFilePath),
      },
    });
    console.info(`File '${fileName}' uploaded successfully.`);
  } catch (error) {
    console.error(`Error uploading file '${fileName}': ${error.message}`);
    throw error;
  }
}

module.exports = uploadFileToStorage;
