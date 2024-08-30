const mongoose = require('mongoose');

const HedingSchema = new mongoose.Schema({
    tital: { type: String, required: true },
    subtital: { type: String, required: true },
    type: { type: String, required: true }  // New field to differentiate
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('Heding', HedingSchema);
