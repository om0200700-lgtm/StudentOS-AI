const mongoose = require('mongoose');

const subjectGradeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1
  },
  grade: {
    type: String,
    enum: ['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'],
    required: true
  },
  gradePoint: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  }
});

const semesterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  semesterNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  sgpa: {
    type: Number,
    required: true,
    default: 0
  },
  totalCredits: {
    type: Number,
    required: true,
    default: 0
  },
  subjects: [subjectGradeSchema]
}, {
  timestamps: true
});

// Ensure a user cannot have two semesters with the same number
semesterSchema.index({ user: 1, semesterNumber: 1 }, { unique: true });

module.exports = mongoose.model('Semester', semesterSchema);
