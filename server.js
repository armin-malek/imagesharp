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
app.post("/resize", (req, res) => {
  startDl(req.body).then(() => {
    res.status(200).send("done");
  });
});
app.listen(port, () => console.log(`Resizer is running on ${port}`));

async function startDl(body) {
  body.imgs.forEach((element) => {
    downloadImage(element, body.width).then(() => {});
  });
}
async function downloadImage(url, width = 900) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  sharp(res.data)
    .resize(width)
    .webp()
    .toBuffer()
    .then((data) => {
      let loc =
        __dirname +
        "/" +
        url
          .split("/")
          .pop()
          .replace("png", "webp")
          .replace("jpg", "webp")
          .replace("jpeg", "webp");
      fs.promises.writeFile(loc, data);
      console.log(loc);
    })
    .catch((err) => {
      Console.log(err);
    });
}

/*
.replace("png", "webp")
            .replace("jpg", "webp")
            .replace("jpeg", "webp")


*/
