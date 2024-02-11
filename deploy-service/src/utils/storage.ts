import { BlobServiceClient } from "@azure/storage-blob";
import { createWriteStream, promises as fsPromises } from "fs";
import path, { dirname } from "path";

const connStr = process.env.BLOB_CONN_STR ?? "";

const CONTAINER_NAME = "deployify";

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

export async function downloadFromStorage(dirName: string) {
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const containerExists = await containerClient.exists();
  if (!containerExists) {
    console.log("Container not found");
    return;
  }
  const blobIterator = containerClient.listBlobsFlat({ prefix: dirName });
  for await (const blob of blobIterator) {
    const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
    const filePath = path.join(__dirname, "..", "blob", blob.name);

    await fsPromises.mkdir(dirname(filePath), { recursive: true });

    try {
      const response = await blockBlobClient.download();
      const writeStream = createWriteStream(filePath);
      await new Promise<void>((resolve, reject) => {
        response
          .readableStreamBody!.pipe(writeStream)
          .on("finish", resolve)
          .on("error", reject);
      });
      console.log(
        `File '${blob.name}' downloaded successfully to '${filePath}'.`
      );
    } catch (error: any) {
      console.log(`Error downloading file '${blob.name}': ${error.message}`);
    }
  }
}
