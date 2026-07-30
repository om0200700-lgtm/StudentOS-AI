const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// @desc    Create assignment
// @route   POST /api/academic/assignments
// @access  Private (Admin/Faculty)
exports.createAssignment = async (req, res, next) => {
  try {
    req.body.faculty = req.user.id;
    const assignment = await Assignment.create(req.body);
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assignments
// @route   GET /api/academic/assignments
// @access  Private
exports.getAssignments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'faculty') {
      query = { faculty: req.user.id };
    } else if (req.user.role === 'student') {
      // Students see assignments for their semester/section if applicable
      if (req.user.semester) query.semester = req.user.semester;
    }
    
    const assignments = await Assignment.find(query)
      .populate('subject', 'name subjectCode')
      .populate('faculty', 'name');
      
    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assignment
// @route   POST /api/academic/assignments/:id/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res, next) => {
  try {
    req.body.student = req.user.id;
    req.body.assignment = req.params.id;
    const submission = await Submission.create(req.body);
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submissions for assignment
// @route   GET /api/academic/assignments/:id/submissions
// @access  Private (Admin/Faculty)
exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.id })
      .populate('student', 'name rollNumber');
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    next(error);
  }
};
