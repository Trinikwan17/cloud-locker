require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/files', fileRoutes); 

app.get('/', (req, res) => {
  res.send('Cloud Locker Backend is Running! 🚀');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("DB Connection Error: ", err));

 app.listen(3000, "0.0.0.0", () => {
  console.log("Server running");
});
