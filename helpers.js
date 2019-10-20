import { createCanvas, Image } from 'canvas';
import fs from 'fs';

export function generateCanvas(url, name, folder) {
  const canvas = createCanvas(308, 340);
  const stream = canvas.createPNGStream();
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  const out = fs.createWriteStream(`./assets/qrcode/${folder}/` + `${name}.png`);
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.onerror = err => {
    throw err;
  };
  img.src = url;
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#74037b';
  ctx.fillText(name, 17, 320);

  stream.pipe(out);
  out.on('finish', () => {});
}
