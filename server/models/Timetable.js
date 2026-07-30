const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  section: { type: String },
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  periods: [{
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    room: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
