import redis, { commandOptions, createClient } from "redis";

const subscribe = createClient();
subscribe.connect();
const QUEUE_NAME = "deploy";
async function main() {
  while (1) {
    const res = await subscribe.brPop(
      commandOptions({ isolated: true }),
      QUEUE_NAME,
      0
    );
    console.log(res);
  }
}

main();
