const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, required: true },
    dec: { type: String, required: true },
    tital: { type: String, required: true },
    number: { type: Number, required: true },
    email: { type: String, required: true },
    WD: { type: Number, required: true },
    AD: { type: Number, required: true },
    DD: { type: Number, required: true },
    GD: { type: Number, required: true },
    CompleteProjects: { type: String, required: true },
    AverageRating: { type: String, required: true },
    HappyClients: { type: String, required: true },
    Twitter: { type: String, required: false },
    WinningAwards: { type: String, required: true },
    facebook: { type: String, required: false },
    instagram: { type: String, required: false }
});

module.exports = mongoose.model('Profile', ProfileSchema);