const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));



mongoose.connect('mongodb+srv://prateekyadav:aDA4VgyDOHdZlDQc@bbcluster.giayb.mongodb.net/BrandBuddies', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

//define influencer schema
const influencerSchema = new mongoose.Schema({
  name: String,
  location: String,
  gender: String,
  socialMediaLink: String,
  platform: String,
  category: String,
  price: Number,
  image: String,
});
const Influencer = mongoose.model('Influencer', influencerSchema);

//multer Configuration for fileupload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

//API endpoint to add new infl
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
  
  //add middleware
  app.use(cors());
  app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
  
  //route newly added infl
  app.get('/newly-added-influencers', async (req, res) => {
    try {
      const newInfluencers = await Influencer.find()
        .sort({ _id: -1 }) 
        .limit(3);
      
      res.json(newInfluencers);
    } catch (error) {
      console.error('Error fetching newly added influencers:', error);
      res.status(500).json({ message: 'Error fetching newly added influencers' });
    }
  });


  module.exports = { Influencer };