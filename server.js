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
      let tmp = await downloadImage(element, body.width, body.thid);
      //console.log("before tmp", tmp);
      if (tmp != undefined) {
        //console.log("OK", tmp);
        tmp = tmp.replace("/app", "");
        //console.log("rr", tmp);
        lins.push(tmp);
      }
    })
  );
  //console.log("return dl", lins);
  return lins;
}
async function downloadImage(url, width = 900, thid) {
  thid = "--" + thid;
  let loc;
  try {
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
            .replace(".png", thid + ".webp")
            .replace(".PNG", thid + ".webp")
            .replace(".jpg", thid + ".webp")
            .replace(".JPG", thid + ".webp")
            .replace(".jpeg", thid + ".webp")
            .replace(".JPEG", thid + ".webp")
            .replace(".gif", thid + ".webp")
            .replace(".GIF", thid + ".webp");
        fs.promises.writeFile(loc, data);
        console.log(loc);
        return loc;
      })
      .catch((err) => {
        Console.log(err);
      });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
    }
  }
  //console.log(loc, "loc");
  return loc;
}
