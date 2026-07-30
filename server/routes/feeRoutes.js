const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/logger');
const sendEmail = require('../utils/email');

// @route   GET /api/fees
// @desc    Get all fees (Admin) or user fees (Student)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.student = req.user.id;
    }
    
    // For admin/faculty, they can see all fees, or filter by student ID
    if (req.user.role !== 'student' && req.query.studentId) {
      query.student = req.query.studentId;
    }
    
    const fees = await Fee.find(query)
      .populate('student', 'name email branch semester')
      .sort({ dueDate: 1 });
      
    res.json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/fees
// @desc    Create fee record
// @access  Private/Admin
router.post('/', protect, authorize('admin'), logActivity('Create Fee', 'Fee'), async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.locals.createdEntity = fee;
    
    const populatedFee = await Fee.findById(fee._id).populate('student', 'name email');
    
    // Send email notification
    if (populatedFee.student && populatedFee.student.email) {
      await sendEmail({
        to: populatedFee.student.email,
        subject: `New Fee Notification: ${fee.description}`,
        html: `
          <h3>Hello ${populatedFee.student.name},</h3>
          <p>A new fee has been added to your account.</p>
          <ul>
            <li><strong>Description:</strong> ${fee.description}</li>
            <li><strong>Amount:</strong> $${fee.totalAmount}</li>
            <li><strong>Due Date:</strong> ${new Date(fee.dueDate).toLocaleDateString()}</li>
          </ul>
          <p>Please log in to your StudentOS portal to view and pay this fee.</p>
        `
      });
    }

    res.status(201).json(fee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   PUT /api/fees/:id/pay
// @desc    Add payment to fee record
// @access  Private
router.put('/:id/pay', protect, logActivity('Pay Fee', 'Fee'), async (req, res) => {
  try {
    const { amount, method } = req.body;
    const fee = await Fee.findById(req.params.id).populate('student', 'name email');
    
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });
    
    // Students can only pay their own fees
    if (req.user.role === 'student' && fee.student._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this fee record' });
    }

    const payment = {
      amount: Number(amount),
      method: method || 'Online',
      receiptNumber: 'REC-' + Date.now() + Math.floor(Math.random() * 1000)
    };

    fee.payments.push(payment);
    fee.paidAmount += Number(amount);
    
    await fee.save();

    // Send receipt email
    if (fee.student && fee.student.email) {
      await sendEmail({
        to: fee.student.email,
        subject: `Payment Receipt: ${fee.description}`,
        html: `
          <h3>Hello ${fee.student.name},</h3>
          <p>We have received your payment of $${amount}.</p>
          <ul>
            <li><strong>Receipt No:</strong> ${payment.receiptNumber}</li>
            <li><strong>Method:</strong> ${payment.method}</li>
            <li><strong>Remaining Balance:</strong> $${fee.totalAmount - fee.paidAmount}</li>
          </ul>
        `
      });
    }

    res.json(fee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   DELETE /api/fees/:id
// @desc    Delete fee record
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), logActivity('Delete Fee', 'Fee'), async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ error: 'Fee not found' });
    res.json({ message: 'Fee record removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/fees/stats
// @desc    Get fee statistics (Admin)
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const fees = await Fee.find({});
    
    const stats = {
      totalFees: 0,
      totalCollected: 0,
      totalPending: 0,
      statusCounts: {
        Paid: 0,
        Partial: 0,
        Pending: 0
      }
    };

    fees.forEach(fee => {
      stats.totalFees += fee.totalAmount;
      stats.totalCollected += fee.paidAmount;
      stats.statusCounts[fee.status]++;
    });

    stats.totalPending = stats.totalFees - stats.totalCollected;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
