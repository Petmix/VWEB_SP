const { Schema, default: mongoose } = require("mongoose");

const commentSchema = new Schema({
    username: String,
    text: String,
    likes: Number,
    dislikes: Number
});

const movieSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    release_date: { type: Date, default: Date.now() },
    favorited: { type: Boolean },
    rating: { type: Double, min: 0.0, max: 10.0 },
    comments: [commentSchema]
});

module.exports = mongoose.model("Movie", movieSchema);