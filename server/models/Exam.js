const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Internal', 'External'],
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  subjects: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    room: {
      type: String
    },
    maxMarks: {
      type: Number,
      default: 100
    },
    passingMarks: {
      type: Number,
      default: 35
    }
  }],
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming'
  },
  resultPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Auto-update status based on dates
examSchema.pre('save', function(next) {
  const now = new Date();
  if (this.endDate < now) {
    this.status = 'Completed';
  } else if (this.startDate <= now && this.endDate >= now) {
    this.status = 'Ongoing';
  } else {
    this.status = 'Upcoming';
  }
  next();
});

module.exports = mongoose.model('Exam', examSchema);
