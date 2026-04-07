router.post('/upload', upload.single('document'), async (req, res) => {
  console.log("===== UPLOAD REQUEST RECEIVED =====");

  try {
    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log("✅ File received:");
    console.log(req.file);

    // 🔥 FIX: use local file URL
    const fileUrl = `http://13.62.50.44:5000/uploads/${req.file.filename}`;

    const newFile = new File({
      originalName: req.file.originalname,
      s3Url: fileUrl,   // keep field name same, just store local URL
      s3Key: req.file.filename
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
