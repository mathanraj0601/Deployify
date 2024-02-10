import { Endpoint, S3 } from "aws-sdk";
import { readFileSync } from "fs";

const s3 = new S3({
  secretAccessKey: "",
  accessKeyId: "",
  endpoint: "",
});

export async function uploadFileToStorage(
  fileName: string,
  localFilePath: string
) {
  const file = readFileSync(localFilePath);
  const params = {
    Bucket: "",
    Key: fileName,
    Body: file,
  };
  await s3.upload(params);
}
