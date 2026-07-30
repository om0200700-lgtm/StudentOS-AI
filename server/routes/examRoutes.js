const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/logger');

// @route   GET /api/exams
// @desc    Get all exams
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    // For students, filter by their branch/semester (basic filtering)
    if (req.user.role === 'student') {
      if (req.user.branch) query.branch = req.user.branch;
      if (req.user.semester) query.semester = req.user.semester;
    }

    const exams = await Exam.find(query).populate('subjects.subject', 'name code').sort({ startDate: 1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/exams
// @desc    Create exam schedule
// @access  Private/Admin
router.post('/', protect, authorize('admin'), logActivity('Create Exam', 'Exam'), async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.locals.createdEntity = exam;
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   PUT /api/exams/:id
// @desc    Update exam
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), logActivity('Update Exam', 'Exam'), async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   DELETE /api/exams/:id
// @desc    Delete exam
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), logActivity('Delete Exam', 'Exam'), async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
