const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  credits: { type: Number, required: true, min: 1 },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  semester: { type: Number, required: true },
  department: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
