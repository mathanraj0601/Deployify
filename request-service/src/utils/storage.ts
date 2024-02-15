import { BlobServiceClient } from "@azure/storage-blob";

const connStr = process.env.BLOB_CONN_STR ?? "";
const CONTAINER_NAME = "deployify";

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

export async function downloadBlobAsBuffer(blobName: string) {
  try {
    // Get a reference to a container
    const containerClient =
      blobServiceClient.getContainerClient(CONTAINER_NAME);

    // Get a reference to a blob
    const blobClient = containerClient.getBlobClient(blobName);

    // Download blob content as a Buffer
    const response = await blobClient.download();
    const content = await streamToBuffer(response.readableStreamBody);
    return content;
  } catch (error) {
    console.error("Error downloading blob:", error);
    throw error; // Rethrow the error for the calling code to handle
  }
}

async function streamToBuffer(stream: any) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
