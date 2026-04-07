router.post('/upload', upload.single('document'), async (req, res) => {
  console.log("===== UPLOAD REQUEST RECEIVED =====");

  try {
    // Check if file is received
    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log("✅ File received from multer:");
    console.log(req.file);

    // Check S3 values
    console.log("S3 Location:", req.file.location);
    console.log("S3 Key:", req.file.key);

    const newFile = new File({
      originalName: req.file.originalname,
      s3Url: req.file.location,
      s3Key: req.file.key
    });

    const savedFile = await newFile.save();

    console.log("✅ Saved to MongoDB:", savedFile);

    res.status(201).json({
      message: 'File uploaded successfully!',
      file: savedFile
    });

  } catch (error) {
    console.error("🔥 Upload Error:", error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});
