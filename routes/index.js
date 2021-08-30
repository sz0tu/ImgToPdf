const { Router } = require('express');
const uploadFile = require("../middleware/uploadFile");
const fs = require("fs");
const PDFDocument =  require('pdfkit');
const multer = require("multer");
const path = require("path");

const router = Router();

/* GET index page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Converter image to pdf',
  });
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = function (req, file, cb) {
  if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

var upload = multer({ storage: storage, fileFilter: imageFilter });

router.post('/generatePDF',  async (req, res, next) => {
  const myDoc = new PDFDocument({bufferPages: true});

  let buffers = [];
  myDoc.on('data', buffers.push.bind(buffers));
  myDoc.on('end', () => {

    let pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(pdfData),
      'Content-Type': 'application/pdf',
      'Content-disposition': 'attachment;filename=test.pdf',})
        .end(pdfData);

  });
  const pathImage = path.join(__dirname+ '/../public', 'uploads/')+req.files.image.name
  await req.files.image.mv(pathImage, function(err) {})
    myDoc.image(pathImage, {
    fit: [200, 200],
    align: 'center',
    valign: 'center'
  });
  myDoc.end();


});

module.exports = router;
