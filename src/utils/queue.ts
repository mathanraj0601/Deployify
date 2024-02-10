import { createClient } from "redis";

const publisher = createClient();
publisher.connect();
const QUEUE_NAME = "deploy";
export async function addToQueue(id: string, status: string) {
  await publisher.lPush(QUEUE_NAME, id);
}
