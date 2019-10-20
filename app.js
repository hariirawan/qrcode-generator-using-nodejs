import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import csv from 'csv-parser';
import stream from 'stream';
import QRCode from 'qrcode';
import fs from 'fs';
import { generateCanvas } from './helpers';

const app = express();
const storage = multer.memoryStorage();
var upload = multer({ storage: storage });

app.set('view engine', 'ejs');

app.use(express.static('./assets'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/qrcode', upload.single('csvFile'), async (req, res, next) => {
  const { folder } = req.body;
  const { buffer: bufferCSV } = req.file;

  if (!fs.existsSync(`./assets/qrcode/${folder}`)) {
    fs.mkdirSync(`./assets/qrcode/${folder}`);
  }

  const bufferStream = new stream.PassThrough();
  bufferStream.end(new Buffer.from(bufferCSV));
  await bufferStream
    .pipe(csv())
    .on('data', function(data) {
      try {
        const options = { errorCorrectionLevel: 'H', width: 308 };
        QRCode.toDataURL(JSON.stringify(data), options, function(_, url) {
          generateCanvas(url, `${data.unitName}-${data.billTypeName}`, folder);
        });
      } catch (err) {
        console.log(err);
      }
    })
    .on('end', function() {
      console.log('Generate qr code selesai');
    });
});

app.listen(1994, () => console.log('Server started at port 1994'));
