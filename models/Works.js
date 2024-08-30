const mongoose = require('mongoose');

const WorksSchema = new mongoose.Schema({
    tital1: { type: String, required: true },
    subtital: { type: String, required: true },
    pImg: { type: String, required: true }, // Main image
    ps1img: { type: String, required: false }, // Secondary image
    title: { type: String, required: true },
    filterName: { type: String, required: false },
    description: { type: String, required: true },
    description1: { type: String, required: false },
    type: { type: String, enum: ['work', 'blog', 'client', 'service'], required: true }  // New field to differentiate
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('Works', WorksSchema);
