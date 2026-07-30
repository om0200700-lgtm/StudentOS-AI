const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  status: { type: String, enum: ['submitted', 'graded', 'late'], default: 'submitted' },
  grade: { type: Number },
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
