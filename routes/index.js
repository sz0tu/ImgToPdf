const { Router } = require('express');
const PDFDocument =  require('pdfkit');
const path = require("path");
const upload = require("../middleware/uploadFile")
const router = Router();

/* GET index page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Converter image to pdf',
  });
});

const ALLOWED_EXTENSION = ['.png', '.jpg', '.jpeg']

router.post('/generatePDF',  upload.array("image"), async (req, res) => {
  const myDoc = new PDFDocument({bufferPages: true, margin: 60});
  const {fileName} = req.body
  let buffers = [];
  myDoc.on('data', buffers.push.bind(buffers));
  myDoc.on('end', () => {

    let pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(pdfData),
      'Content-Type': 'application/pdf',
      'Content-disposition': `attachment;filename=${fileName}.pdf`,})
        .end(pdfData);

  });

  const marginTop = 20
let positionY = marginTop
  for(let file of req.files) {
    const pathImage = path.join(__dirname+ '/../public', 'uploads/')+file.filename
    if(positionY > 800) {
      positionY = marginTop
      myDoc.addPage()
    }
    if(ALLOWED_EXTENSION.includes(path.extname(file.originalname))) {
      myDoc.image(pathImage, 67.5, positionY , {
          width: 460,
          height: 380,
          align: "center",
          valign: "center"
      })
          .text(file.originalname, 0, positionY);
      positionY += 420
    }

  }

  myDoc.end();


});

module.exports = router;
