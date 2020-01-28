import { createCanvas, Image } from "canvas";
import fs from "fs";

export function generateCanvas(url, name, folder) {
  const canvas = createCanvas(76, 106);
  const stream = canvas.createPNGStream();
  const ctx = canvas.getContext("2d");

  ctx.rect(0, 0, 76, 106);
  ctx.fillStyle = "#000000";
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, 76, 76);
  const img = new Image();
  const out = fs.createWriteStream(
    `./assets/qrcode/${folder}/` + `${name}.png`
  );
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.onerror = err => {
    throw err;
  };
  img.src = url;

  ctx.font = "8px arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText(name, 76 / 2, 95, 106);

  stream.pipe(out);
  out.on("finish", () => {});
}

export function readTotalQR() {
  var air = fs.readdirSync(`./assets/qrcode/air`);
  var listrik = fs.readdirSync(`./assets/qrcode/listrik`);
  console.log(`Success generate qr code: `, air.length, listrik.length);
}

export const deleteFolderRecursive = function(path) {
  console.log("Jalsn");
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = Path.join(path, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
