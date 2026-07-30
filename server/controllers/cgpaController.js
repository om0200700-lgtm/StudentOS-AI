const Semester = require('../models/Semester');

// Helper to calculate Grade Points based on Letter Grade
const getGradePoint = (grade) => {
  const map = { 'O': 10, 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 0 };
  return map[grade] !== undefined ? map[grade] : 0;
};

// Helper to calculate SGPA and total credits for a semester
const calculateSemesterStats = (subjects) => {
  let totalCredits = 0;
  let totalPoints = 0;

  subjects.forEach(sub => {
    const gp = getGradePoint(sub.grade);
    sub.gradePoint = gp;
    totalCredits += sub.credits;
    totalPoints += (sub.credits * gp);
  });

  const sgpa = totalCredits === 0 ? 0 : (totalPoints / totalCredits);
  return { sgpa: Number(sgpa.toFixed(2)), totalCredits, subjects };
};

// @desc    Get all semesters for logged in user and calculate overall CGPA
// @route   GET /api/cgpa
// @access  Private
exports.getSemesters = async (req, res, next) => {
  try {
    const semesters = await Semester.find({ user: req.user.id }).sort('semesterNumber');
    
    // Calculate overall CGPA
    let totalOverallCredits = 0;
    let totalOverallPoints = 0;

    semesters.forEach(sem => {
      totalOverallCredits += sem.totalCredits;
      totalOverallPoints += (sem.sgpa * sem.totalCredits);
    });

    const cgpa = totalOverallCredits === 0 ? 0 : (totalOverallPoints / totalOverallCredits);

    res.status(200).json({ 
      success: true, 
      count: semesters.length, 
      cgpa: Number(cgpa.toFixed(2)),
      totalCredits: totalOverallCredits,
      data: semesters 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new semester
// @route   POST /api/cgpa
// @access  Private
exports.addSemester = async (req, res, next) => {
  try {
    const { semesterNumber, subjects } = req.body;
    
    // Calculate stats before saving
    const stats = calculateSemesterStats(subjects || []);

    const semester = await Semester.create({
      user: req.user.id,
      semesterNumber,
      sgpa: stats.sgpa,
      totalCredits: stats.totalCredits,
      subjects: stats.subjects
    });

    res.status(201).json({ success: true, data: semester });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a semester
// @route   PUT /api/cgpa/:id
// @access  Private
exports.updateSemester = async (req, res, next) => {
  try {
    let semester = await Semester.findById(req.params.id);

    if (!semester) return res.status(404).json({ success: false, message: 'Semester not found' });
    if (semester.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

    const { subjects, semesterNumber } = req.body;
    const stats = calculateSemesterStats(subjects || semester.subjects);

    semester = await Semester.findByIdAndUpdate(req.params.id, {
      semesterNumber: semesterNumber || semester.semesterNumber,
      sgpa: stats.sgpa,
      totalCredits: stats.totalCredits,
      subjects: stats.subjects
    }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: semester });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a semester
// @route   DELETE /api/cgpa/:id
// @access  Private
exports.deleteSemester = async (req, res, next) => {
  try {
    const semester = await Semester.findById(req.params.id);

    if (!semester) return res.status(404).json({ success: false, message: 'Semester not found' });
    if (semester.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

    await semester.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
