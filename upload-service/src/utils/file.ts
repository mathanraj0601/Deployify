import fs from "fs";
import path from "path";

export function getAllFilePath(dirPath: string): string[] {
  let response: string[] = [];
  let currentDirFiles = fs.readdirSync(dirPath);
  currentDirFiles.forEach((file) => {
    let filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      response = response.concat(getAllFilePath(filePath));
    } else {
      response.push(filePath);
    }
  });
  return response;
}
