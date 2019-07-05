const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer  = require('multer');
const upload = multer({dest: './public/uploads/',
                      limits: {fileSize: 1000000, files:1},
                      });
router.route('/get-file-size/')
// req.body will hold the text fields, if there is any 
.post( upload.single('file'), function (req, res, next) {
  let fileInfo = {
    "file_name": req.file.originalname,
    "file_size": `${req.file.size} bytes`
  };
 
  res.json(fileInfo);
  //Deleting the file because we currently are not managing the upload files  
  fs.unlinkSync(req.file.path);
})

module.exports = router;