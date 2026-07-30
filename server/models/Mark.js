const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  examType: { type: String, enum: ['internal', 'external', 'practical'], required: true },
  marksObtained: { type: Number, required: true, min: 0 },
  maxMarks: { type: Number, required: true },
  semester: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Mark', markSchema);
