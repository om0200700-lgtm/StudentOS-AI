const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide department name'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please provide department code (e.g., CSE)'],
    unique: true,
    uppercase: true,
    trim: true
  },
  hod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
