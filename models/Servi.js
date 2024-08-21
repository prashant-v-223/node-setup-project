const mongoose = require('mongoose');

const ServiSchema = new mongoose.Schema({
    pImg: { type: String, required: true }, // Main image
    ps1img: { type: String, required: false }, // Secondary image
    title: { type: String, required: true },
    filterName: { type: String, required: false },
    description: { type: String, required: true },
    type: { type: String, enum: ['work', 'blog', 'client'], required: true }  // New field to differentiate
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('Servi', ServiSchema);
