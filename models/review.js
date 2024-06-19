// models/rating.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String},
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
