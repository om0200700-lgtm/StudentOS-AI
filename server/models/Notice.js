const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetAudience: { type: String, enum: ['all', 'students', 'faculty', 'department'], default: 'all' },
  department: { type: String },
  type: { type: String, enum: ['college', 'department'], default: 'college' }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
