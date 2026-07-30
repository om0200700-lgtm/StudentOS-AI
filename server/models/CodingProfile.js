const mongoose = require('mongoose');

const codingProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  stats: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 }
  },
  topics: {
    arrays: { type: Number, default: 0 },
    strings: { type: Number, default: 0 },
    linkedLists: { type: Number, default: 0 },
    trees: { type: Number, default: 0 },
    graphs: { type: Number, default: 0 },
    dp: { type: Number, default: 0 }
  },
  platforms: {
    leetcode: { username: String, rating: Number },
    hackerrank: { username: String, badges: Number },
    github: { username: String, contributions: Number }
  },
  streak: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('CodingProfile', codingProfileSchema);
