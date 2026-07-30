const ClassAttendance = require('../models/ClassAttendance');

// @desc    Mark attendance for a class
// @route   POST /api/academic/attendance
// @access  Private (Faculty/Admin)
exports.markAttendance = async (req, res, next) => {
  try {
    req.body.faculty = req.user.id;
    const attendance = await ClassAttendance.create(req.body);
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records
// @route   GET /api/academic/attendance
// @access  Private
exports.getAttendance = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      // Student sees records where they are in the records array
      query = { 'records.student': req.user.id };
    } else if (req.user.role === 'faculty') {
      // Faculty sees their own classes
      query = { faculty: req.user.id };
    }
    
    const records = await ClassAttendance.find(query)
      .populate('subject', 'name subjectCode')
      .populate('faculty', 'name')
      .populate('records.student', 'name rollNumber');
      
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};
