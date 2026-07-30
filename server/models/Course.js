const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide course name'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please provide course code (e.g., BTECH-CSE)'],
    unique: true,
    uppercase: true,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Course must belong to a department']
  },
  totalSemesters: {
    type: Number,
    required: true,
    default: 8
  },
  creditsRequired: {
    type: Number,
    required: true,
    default: 160
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
