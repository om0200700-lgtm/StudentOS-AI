const Mark = require('../models/Mark');

// @desc    Upload mark
// @route   POST /api/academic/marks
// @access  Private (Faculty/Admin)
exports.uploadMark = async (req, res, next) => {
  try {
    const mark = await Mark.create(req.body);
    res.status(201).json({ success: true, data: mark });
  } catch (error) {
    next(error);
  }
};

// @desc    Get marks
// @route   GET /api/academic/marks
// @access  Private
exports.getMarks = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query = { student: req.user.id };
    }
    
    const marks = await Mark.find(query)
      .populate('subject', 'name subjectCode credits')
      .populate('student', 'name rollNumber branch');
      
    res.status(200).json({ success: true, count: marks.length, data: marks });
  } catch (error) {
    next(error);
  }
};
