const mongoose = require('mongoose');

const attendanceLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'cancelled'],
    required: true
  }
});

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectName: {
    type: String,
    required: [true, 'Please add a subject name'],
    trim: true,
    maxlength: [50, 'Subject name cannot be more than 50 characters']
  },
  totalClasses: {
    type: Number,
    default: 0,
    min: 0
  },
  attendedClasses: {
    type: Number,
    default: 0,
    min: 0
  },
  targetPercentage: {
    type: Number,
    default: 75,
    min: 0,
    max: 100
  },
  logs: [attendanceLogSchema]
}, {
  timestamps: true
});

// Ensure a user cannot have two subjects with the same name
attendanceSchema.index({ user: 1, subjectName: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
