const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();
app.use(bodyParser.json());
app.use(cors());




const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

//signup Route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        //check if user already exist
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        //save new usr
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        //find user in databse
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



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

 

 
  
  //add middleware
  app.use(express.json());
app.use(cors({
  origin: 'localhost:3000',
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


  app.use(express.static(__dirname));

// Dynamically serve any HTML file based on request
app.get('/:fileName', (req, res) => {
    const fileName = req.params.fileName; // Get file name from URL
    const filePath = path.join(__dirname, `${fileName}.html`);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found!');
        }
    });
});



  module.exports = { Influencer };