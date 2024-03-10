import express from "express";
import cors from "cors";
import { generateRandom } from "./utils/randomString";
import Docker from "dockerode";
const docker = new Docker();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/deploy", async (req, res) => {
  const { repoUrl, projectId } = req.body;
  const id = projectId ?? generateRandom();
  const containerName = id;
  const imageName = "mathanraj0601/deployify:1.0.0";

  const createOptions = {
    Image: imageName,
    name: containerName,
    Env: [
      `GITHUB_LINK=${repoUrl}`,
      `PROJECT_ID=${id}`,
      "BLOB_CONN_STR=<connection-string>",
      "FRAMEWORK=ANGULAR",
    ],
  };

  try {
    docker.createContainer(createOptions, (err, container) => {
      if (err) {
        console.log(err, "error");
        return;
      }

      container?.start((err, data) => {
        console.log(err + "error");
        console.log(data + "data");
      });
    });

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
