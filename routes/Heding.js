const express = require('express');
const router = express.Router();
const Heding = require('../models/Heding');

// 1. Create a new Heding entry (POST)
router.post('/hedings', async (req, res) => {
    try {
        const newHeding = new Heding(req.body);
        const savedHeding = await newHeding.save();
        res.status(201).json(savedHeding);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 2. Get all Heding entries (GET)
router.get('/hedings', async (req, res) => {
    try {
        const hedings = await Heding.find();
        res.status(200).json(hedings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Get a single Heding entry by ID (GET)
router.get('/hedings/:id', async (req, res) => {
    try {
        const heding = await Heding.findById(req.params.id);
        if (!heding) {
            return res.status(404).json({ error: 'Heding not found' });
        }
        res.status(200).json(heding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Update a Heding entry by ID (PUT)
router.put('/hedings/:id', async (req, res) => {
    try {
        const updatedHeding = await Heding.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedHeding) {
            return res.status(404).json({ error: 'Heding not found' });
        }
        res.status(200).json(updatedHeding);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 5. Delete a Heding entry by ID (DELETE)
router.delete('/hedings/:id', async (req, res) => {
    try {
        const deletedHeding = await Heding.findByIdAndDelete(req.params.id);
        if (!deletedHeding) {
            return res.status(404).json({ error: 'Heding not found' });
        }
        res.status(200).json({ message: 'Heding deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
