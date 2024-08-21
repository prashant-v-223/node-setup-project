const mongoose = require('mongoose');
const CommentsSchema = new mongoose.Schema({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Works', required: true },  // References the Works (blog) schema
    RepID: { type: mongoose.Schema.Types.ObjectId, },  // References the Works (blog) schema
    author: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('Comments', CommentsSchema);
