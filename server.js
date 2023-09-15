const express = require("express");
const { getFaceLandMarks } = require("./face");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.get("/", (req, res) => res.send("Hello World!"));

app.post("/face", async (req, res) => {
  const { image } = req.body;

  const landmarks = await getFaceLandMarks(base64TOBuffer(image));

  res.send({ ok: true, landmarks });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function base64TOBuffer(base64) {
  let uri = base64.split(";base64,").pop();
  return Buffer.from(uri, "base64");
}
