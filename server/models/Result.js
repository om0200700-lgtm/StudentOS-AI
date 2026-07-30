const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  semester: { type: Number, required: true },
  subjects: [{
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    internalMarks: { type: Number, default: 0 },
    externalMarks: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    grade: { type: String }
  }],
  sgpa: { type: Number, required: true, default: 0 },
  cgpa: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['Pass', 'Fail', 'Promoted'], default: 'Pass' },
  remarks: { type: String }
}, { timestamps: true });

// Grade calculation pre-save hook
resultSchema.pre('save', function(next) {
  let totalCredits = 0;
  let earnedPoints = 0;
  let hasFailed = false;

  this.subjects.forEach(sub => {
    sub.totalMarks = sub.internalMarks + sub.externalMarks;
    
    // Assign Grade
    if (sub.totalMarks >= 90) sub.grade = 'O';
    else if (sub.totalMarks >= 80) sub.grade = 'A+';
    else if (sub.totalMarks >= 70) sub.grade = 'A';
    else if (sub.totalMarks >= 60) sub.grade = 'B+';
    else if (sub.totalMarks >= 50) sub.grade = 'B';
    else if (sub.totalMarks >= 40) sub.grade = 'C';
    else {
      sub.grade = 'F';
      hasFailed = true;
    }
  });

  if (hasFailed) {
    this.status = 'Fail';
  } else {
    this.status = 'Pass';
  }
  
  next();
});

module.exports = mongoose.model('Result', resultSchema);
