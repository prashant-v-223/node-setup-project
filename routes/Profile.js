const express = require('express');
const router = express.Router();
const Profile = require('../models/ProfileSchema');

// Create a new profile
router.post('/', async (req, res) => {
  try {
    const newProfile = new Profile(req.body);
    console.log("req.body", req.body);

    const savedProfile = await newProfile.save();
    res.json(savedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a profile by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProfile) return res.status(404).json({ error: 'Profile not found' });
    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a profile by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) return res.status(404).json({ error: 'Profile not found' });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
