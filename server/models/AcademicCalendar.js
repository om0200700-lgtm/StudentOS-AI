const mongoose = require('mongoose');

const academicCalendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  type: {
    type: String,
    enum: ['holiday', 'exam', 'event', 'term'],
    required: [true, 'Please specify event type']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  description: {
    type: String,
    default: ''
  },
  audience: {
    type: String,
    enum: ['all', 'students', 'faculty'],
    default: 'all'
  }
}, { timestamps: true });

module.exports = mongoose.model('AcademicCalendar', academicCalendarSchema);
