import express from "express";
import cors from "cors";
import { downloadBlobAsBuffer } from "./utils/storage";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/*", async (req, res) => {
  const id = req.hostname.split(".")[0];
  const filePath = req.path !== "/" ? req.path : "/index.html";
  console.log(filePath);
  const type = getContentType(filePath);

  console.log("project-build/" + id + "/dist" + filePath);
  const file = await downloadBlobAsBuffer(
    "project-build/" + id + "/dist" + filePath
  );
  res.set("Content-Type", type);

  res.send(file);
});

function getContentType(filePath: string) {
  if (filePath.endsWith(".html")) {
    return "text/html";
  } else if (filePath.endsWith(".css")) {
    return "text/css";
  } else if (filePath.endsWith(".js")) {
    return "application/javascript";
  } else {
    return "text/plain";
  }
}

const port = 3001;
app.listen(port, () => {
  console.info(`Server is listening on port :${port}`);
});
