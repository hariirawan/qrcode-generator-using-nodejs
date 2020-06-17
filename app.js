import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import csv from "csv-parser";
import stream from "stream";
import QRCode from "qrcode";
import { generateCanvas, readTotalQR, deleteFolderRecursive } from "./helpers";

const path = require("path");

const zl = require("zip-lib");
const app = express();
const storage = multer.memoryStorage();
var upload = multer({ storage: storage });

app.set("view engine", "ejs");

app.use(express.static("./assets"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  // if (!fs.existsSync(`./assets/qrcode/air`)) {
  //   fs.mkdirSync(`./assets/qrcode/air`);
  // }

  // if (!fs.existsSync(`./assets/qrcode/listrik`)) {
  //   fs.mkdirSync(`./assets/qrcode/listrik`);
  // }

  res.render("index");
});

app.get("/testing", function(req, res, next) {
  var filePath = "./assets"; // Or format the path using the `id` rest param
  var fileName = "qrcode.zip"; // The default name the browser will use
  res.download(path.join(filePath, fileName));
});

app.post("/qrcode", upload.single("csvFile"), async (req, res, next) => {
  const { folder } = req.body;
  const { buffer: bufferCSV } = req.file;
  const bufferStream = new stream.PassThrough();
  bufferStream.end(new Buffer.from(bufferCSV));
  await bufferStream
    .pipe(csv())
    .on("data", function(data) {
      try {
        let dataQrCode = `${data.unitID};${data.unitName};${data.floorName};${data.towerName};${data.biilTypeID};${data.billTypeName}`;

        const options = {
          errorCorrectionLevel: "L",
          scale: 5,
          margin: 2,
          maskPattern: 2,
          width: 76
        };
        QRCode.toDataURL(dataQrCode, options, function(_, url) {
          generateCanvas(
            url,
            `${data.unitName.split("/").join("-")}-${data.billTypeName}`,
            folder
          );
        });
      } catch (err) {
        console.log(err);
      }
    })
    .on("end", function() {
      console.log("Generate qr code selesai");
    });

  await zl.archiveFolder("./assets/qrcode", "./assets/qrcode.zip").then(
    function() {
      console.log("done");
    },
    function(err) {
      console.log(err);
    }
  );

  await readTotalQR();
});

app.listen(1994, () => console.log("Server started at port 1994"));
