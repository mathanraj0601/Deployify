import redis, { commandOptions, createClient } from "redis";
import { downloadFromStorage } from "./utils/storage";

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
    await downloadFromStorage(FOLDER_NAME + "/" + res?.element);
    console.log(res);
  }
}

main();
