import express from "express";
import cors from "cors";
import { generateRandom } from "./utils/randomString";
import simpleGit from "simple-git";
import path from "path";
import { getAllFilePath } from "./utils/file";
import { uploadFileToStorage } from "./utils/storage";
import { addToQueue } from "./utils/queue";

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
    getAllFiles.forEach((file) => {
      uploadFileToStorage(file.slice(__dirname.length + 1), file);
    });

    https: await addToQueue(id, "uploaded");
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`Server is listening on port :${port}`);
});
