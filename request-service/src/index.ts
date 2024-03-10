import express from "express";
import cors from "cors";
import httpProxy from "http-proxy";
const app = express();
app.use(express.json());
app.use(cors());

const proxy = httpProxy.createProxy();
const port = 3001;
const BASE_URL = "https://deployify.blob.core.windows.net/deployify";

app.use((req, res) => {
  const subDomain = req.hostname.split(".")[0];
  const targetUrl = `${BASE_URL}/${subDomain}`;
  console.log(subDomain, targetUrl);
  return proxy.web(req, res, { target: targetUrl, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;
  if (url === "/") {
    proxyReq.path += "index.html";
  }
});

app.listen(port, () => {
  console.info(`Server is listening on port :${port}`);
});
