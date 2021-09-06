const multer  = require('multer')
const path = require("path");

const pathUpload =path.join(__dirname+ '/../public', 'uploads/')

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, pathUpload)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname )
    }
})

const upload = multer({storage: storage})


module.exports = upload
