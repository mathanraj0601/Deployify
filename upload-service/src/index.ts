import express from "express";
import cors from "cors";
import { generateRandom } from "./utils/randomString";
import simpleGit from "simple-git";
import path from "path";
import { getAllFilePath } from "./utils/file";
import { uploadFileToStorage } from "./utils/storage";
import { addStaus, addToQueue, getStatus } from "./utils/queue";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/deploy", async (req, res) => {
  const { repoUrl } = req.body;
  // Validate
  const id = generateRandom();

  try {
    const projectDirPath = path.join(__dirname + `/project/${id}`);
    await simpleGit().clone(repoUrl, projectDirPath);
    const getAllFiles = getAllFilePath(projectDirPath);
    const uploadPromises = getAllFiles.map(async (file) => {
      await uploadFileToStorage(file.slice(__dirname.length + 1), file);
    });

    await Promise.all(uploadPromises);

    await addToQueue(id, "uploaded");
    await addStaus(id);
    return res.json({
      data: {
        status: "uploaded",
        id,
      },
      error: null,
    });
  } catch (err) {
    res.json({
      data: {
        status: "failed",
      },
      error: {
        message: "invalid repo link",
      },
    });
  }
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(500);
  try {
    const status = await getStatus(id);
    console.log(status);
    return res.status(200).json({
      data: {
        status: status,
      },
      error: {},
    });
  } catch (err) {
    return res.status(400).json({
      data: {
        status: "failed",
      },
      error: {
        message: "invalid repo link",
      },
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`Server is listening on port :${port}`);
});
