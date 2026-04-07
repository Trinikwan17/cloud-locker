const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../config/s3Config');

// This is the variable that was missing!
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'uploads/' + uniqueSuffix + '-' + file.originalname);
    }
  })
});

// Now Node.js knows what to export
module.exports = upload;