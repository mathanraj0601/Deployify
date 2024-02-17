import redis, { commandOptions, createClient } from "redis";
import { downloadFromStorage, uploadFileToStorage } from "./utils/storage";
import path from "path";
import { buildProject } from "./utils/builder";
import { getAllFilePath } from "./utils/file";
import { updateStatus } from "./utils/redis";

const subscribe = createClient();
subscribe.connect();
const QUEUE_NAME = "deploy";
const FOLDER_NAME = "project";
async function main() {
  while (1) {
    const res = await subscribe.brPop(
      commandOptions({ isolated: true }),
      QUEUE_NAME,
      0
    );
    const filepath = FOLDER_NAME + "/" + res?.element;
    await downloadFromStorage(filepath);

    const dirPath = path.join(__dirname + `/project/${res?.element}`);
    await buildProject(dirPath);
    const getAllFiles = getAllFilePath(dirPath + "/dist");
    const uploadPromises = getAllFiles.map(async (file) => {
      await uploadFileToStorage(
        "project-build/" + file.slice((__dirname + "/project").length + 1),
        file
      );
    });
    await Promise.all(uploadPromises);
    if (res?.element) await updateStatus(res?.element);
  }
}

main();
