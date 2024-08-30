const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema({
    id: { type: Number, required: true }, // Use Number for the unique ID
    name: { type: String, required: true },
    value: { type: String, required: true }
});
const FunFactSchema = new mongoose.Schema({
    id: { type: Number, required: true }, // Use Number for the unique ID
    name: { type: String, required: true },
    value: { type: String, required: true },
    symbol: { type: String, required: true }
});

const ProfileSchema = new mongoose.Schema({
    tital1: { type: String, required: true },
    subtital: { type: String, required: true },
    name: { type: String, required: true },
    img: { type: String, required: true },
    dec: { type: String, required: true },
    tital: { type: String, required: true },
    number: { type: Number, required: true },
    email: { type: String, required: true },
    WD: { type: Number, required: true },
    activity: [activitySchema],
    FunFact: [FunFactSchema],
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
