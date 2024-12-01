const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize the app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://prateekyadav:aDA4VgyDOHdZlDQc@bbcluster.giayb.mongodb.net/BrandBuddies', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Define Influencer Schema and Model
const influencerSchema = new mongoose.Schema({
  name: String,
  location: String,
  gender: String,
  socialMediaLink: String,
  platform: String,
  category: String,
  price: Number,
  image: String, // Will store the image file path
});

const Influencer = mongoose.model('Influencer', influencerSchema);

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  },
});

const upload = multer({ storage: storage });

// API Endpoint to Add New Influencer
app.post('/influencers/add', upload.single('image'), async (req, res) => {
    const { name, location, gender, socialMediaLink, platform, category, price } = req.body;
    const image = req.file ? req.file.path : null;
  
    try {
      const newInfluencer = new Influencer({
        name,
        location,
        gender,
        socialMediaLink,
        platform,
        category,
        price,
        image,
      });
  
      await newInfluencer.save();
      res.status(201).send('Influencer added successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error: Unable to add influencer');
    }
  });

  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

 
  const cors = require('cors');
  
  // Add these middleware
  app.use(cors());
  app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Your frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
  
  // Route for newly added influencers
  app.get('/newly-added-influencers', async (req, res) => {
    try {
      const newInfluencers = await Influencer.find()
        .sort({ _id: -1 }) // Sort by most recently created
        .limit(3); // Limit to 6 most recent influencers
      
      res.json(newInfluencers);
    } catch (error) {
      console.error('Error fetching newly added influencers:', error);
      res.status(500).json({ message: 'Error fetching newly added influencers' });
    }
  });


  module.exports = { Influencer };