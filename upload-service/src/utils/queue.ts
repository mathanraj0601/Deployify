import { createClient } from "redis";

const publisher = createClient();
publisher.connect();
const QUEUE_NAME = "deploy";
export async function addToQueue(id: string, status: string) {
  try {
    await publisher.lPush(QUEUE_NAME, id);
  } catch (err) {
    console.log(err);
  }
}

export async function getStatus(id: any) {
  try {
    return await publisher.get(id);
  } catch (err) {
    console.log(err);
  }
}

export async function addStaus(id: any) {
  try {
    await publisher.set(id, "uploaded");
  } catch (err) {
    console.log(err);
  }
}
