import { createCanvas, Image } from 'canvas';
import fs from 'fs';

export function generateCanvas(url, name, folder) {
  const canvas = createCanvas(76, 100);
  const stream = canvas.createPNGStream();
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  const out = fs.createWriteStream(`./assets/qrcode/${folder}/` + `${name}.png`);
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.onerror = err => {
    throw err;
  };
  img.src = url;
  ctx.font = '10px sans-serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.fillText(name, 5, 90, 100);

  stream.pipe(out);
  out.on('finish', () => {});
}
