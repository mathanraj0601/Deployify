import { createClient } from "redis";

const publisher = createClient();
publisher.connect();
export async function updateStatus(id: string) {
  try {
    await publisher.set(id, "deployed");
  } catch (err) {
    console.log(err);
  }
}
