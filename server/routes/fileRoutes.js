const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const File = require('../models/File');

// POST: Upload a file to S3 and save metadata to MongoDB
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // req.file contains the S3 info provided by multer-s3
    const newFile = new File({
      originalName: req.file.originalname,
      s3Url: req.file.location, // The public URL from AWS S3
      s3Key: req.file.key
    });

    const savedFile = await newFile.save();
    res.status(201).json({ message: 'File uploaded successfully!', file: savedFile });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// GET: Retrieve all files
router.get('/', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files' });
  }
});

module.exports = router;