import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use("/deploy", (req, res) => {
  const { repoUrl } = req.body;
  res.json({
    data: true,
    error: null,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`Server is listening on port :${port}`);
});
