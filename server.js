const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

//fs.mkdirSync("public");
app.use(express.static("./"));
app.use(express.json());
//app.use(express.static("app"));

app.get("/", (req, res) => res.send("I'm Alive!"));
app.post("/resize", async (req, res) => {
  let links = await startDl(req.body);
  console.log("sending");
  res.status(200).send(links);
});
app.listen(port, () => console.log(`Resizer is running on ${port}`));

async function startDl(body) {
  let lins = [];
  await Promise.all(
    body.imgs.map(async (element) => {
      let tmp = await downloadImage(element, body.width);
      tmp = tmp.replace("/app", "");
      console.log("rr", tmp);
      lins.push(tmp);
    })
  ).catch((err) => {});

  console.log("return dl", lins);
  return lins;
}
async function downloadImage(url, width = 900) {
  let loc;
  const res = await axios.get(url, { responseType: "arraybuffer" });
  await sharp(res.data)
    .resize(width)
    .webp()
    .toBuffer()
    .then((data) => {
      loc =
        __dirname +
        "/" +
        url
          .split("/")
          .pop()
          .replace("png", "webp")
          .replace("PNG", "webp")
          .replace("jpg", "webp")
          .replace("JPG", "webp")
          .replace("jpeg", "webp")
          .replace("JPEG", "webp")
          .replace("gif", "webp")
          .replace("GIF", "webp");
      fs.promises.writeFile(loc, data);
      console.log(loc);
      return loc;
    })
    .catch((err) => {
      Console.log(err);
    });
  return loc;
}
