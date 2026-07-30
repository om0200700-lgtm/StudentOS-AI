const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  fileUrl: { type: String },
  semester: { type: Number },
  section: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
