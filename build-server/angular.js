const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const uploadFileToStorage = require("./storage");

const PROJECT_ID = process.env.PROJECT_ID;

async function init() {
  console.info("Deployment started");
  const outputDirPath = path.join(__dirname + "output");
  const p = exec(`cd ${outputDirPath} && npm install && ng build`);

  p.stdout.on("data", (data) => {
    console.info(data);
  });

  p.stdout.on("error", (data) => {
    console.error(data);
  });

  p.on("close", async (data) => {
    const distDirPath = path.join(__dirname + "output" + "dist");
    const allFiles = fs.readdirSync(distDirPath, { recursive: true });
    for (const file of allFiles) {
      const filePath = path.join(distDirPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;
      await uploadFileToStorage(`${PROJECT_ID}/${file}`, filePath);
      console.log(`Uploading ${file}`);
    }
  });
}

init();
