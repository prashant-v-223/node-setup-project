const express = require('express');
const router = express.Router();
const Works = require('../models/Works');
router.post('/', async (req, res) => {
  try {
    const newWork = new Works(req.body);
    console.log("req.body", req.body.editingId);
    if (req.body.editingId === undefined) {

      const savedWork = await newWork.save();
      res.json(savedWork);
    } else {

      const savedWork = await Works.findByIdAndUpdate({ _id: req.body.editingId }, { ...req.body })
      res.json(savedWork);
    }
  } catch (err) {
    console.log("err.message", err.message);

    res.status(500).json({ error: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const deletedProfile = await Works.findByIdAndDelete(req.params.id);
    if (!deletedProfile) return res.status(404).json({ error: 'Profile not found' });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Works.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
