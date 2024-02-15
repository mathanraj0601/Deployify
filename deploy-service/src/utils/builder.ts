import { exec, spawn } from "child_process";

export async function buildProject(dirname: string) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(`cd ${dirname} && npm install && npm run build`);

    childProcess.stderr?.on("err", (err) => {
      console.log(`stderr : ${err}`);
    });

    childProcess.stdout?.on("data", (data) => {
      console.log(`stdout : ${data}`);
    });

    childProcess.on("close", (data) => {
      console.log(`sucessfully build : ${data}`);
      resolve("");
    });
  });
}
