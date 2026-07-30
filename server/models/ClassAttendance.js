const mongoose = require('mongoose');

const classAttendanceSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  semester: { type: Number, required: true },
  section: { type: String },
  records: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['present', 'absent'], required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ClassAttendance', classAttendanceSchema);
