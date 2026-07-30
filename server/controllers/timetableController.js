const Timetable = require('../models/Timetable');

// @desc    Create timetable
// @route   POST /api/academic/timetable
// @access  Private (Admin/Faculty)
exports.createTimetable = async (req, res, next) => {
  try {
    const timetable = await Timetable.create(req.body);
    res.status(201).json({ success: true, data: timetable });
  } catch (error) {
    next(error);
  }
};

// @desc    Get timetable
// @route   GET /api/academic/timetable
// @access  Private
exports.getTimetable = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'student' && req.user.department && req.user.semester) {
      query = { department: req.user.department, semester: req.user.semester };
    }
    
    const timetable = await Timetable.find(query)
      .populate('periods.subject', 'name subjectCode')
      .populate('periods.faculty', 'name');
      
    res.status(200).json({ success: true, count: timetable.length, data: timetable });
  } catch (error) {
    next(error);
  }
};
