const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid'],
    default: 'Pending'
  },
  payments: [{
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    receiptNumber: { type: String, required: true },
    method: { type: String, enum: ['Online', 'Cash', 'Bank Transfer', 'Cheque'], default: 'Online' }
  }],
  description: {
    type: String,
    default: 'Semester Fee'
  }
}, { timestamps: true });

feeSchema.pre('save', function(next) {
  if (this.paidAmount >= this.totalAmount) {
    this.status = 'Paid';
  } else if (this.paidAmount > 0) {
    this.status = 'Partial';
  } else {
    this.status = 'Pending';
  }
  next();
});

module.exports = mongoose.model('Fee', feeSchema);
