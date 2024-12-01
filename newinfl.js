const express = require('express');
const router = express.Router();
const Influencer = require('./server2.js').Influencer; // Export Influencer model from server2.js
const cors = require('cors');
app.use(cors());

//route to get newly aded influencer
router.get('/newly-added-influencers', async (req, res) => {
  try {
    const newInfluencers = await Influencer.find()
      .sort({ _id: -1 })
      .limit(6);
    
    res.json(newInfluencers);
  } catch (error) {
    console.error('Error fetching newly added influencers:', error);
    res.status(500).json({ message: 'Error fetching newly added influencers' });
  }
});

module.exports = router;