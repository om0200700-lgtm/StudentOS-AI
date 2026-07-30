const Result = require('../models/Result');
const Mark = require('../models/Mark');

// @desc    Calculate and save result for a student (Manual Entry)
// @route   POST /api/academic/results/calculate
// @access  Private (Admin/Faculty)
exports.calculateResult = async (req, res, next) => {
  try {
    const { studentId, semester, exam, subjects, remarks } = req.body;
    
    // Result schema has a pre-save hook that calculates grades and status
    // We just need to calculate SGPA and CGPA here manually or rely on the hook
    // Let's calculate SGPA
    let totalMarksAll = 0;
    
    // Create new result
    const result = new Result({
      student: studentId,
      exam: exam,
      semester: semester,
      subjects: subjects,
      remarks: remarks
    });
    
    // The pre-save hook will calculate totalMarks, grade, and pass/fail status
    // For SGPA, we can do a simplified calculation based on total marks
    if (subjects && subjects.length > 0) {
      subjects.forEach(sub => {
        totalMarksAll += (Number(sub.internalMarks) || 0) + (Number(sub.externalMarks) || 0);
      });
      const maxPossible = subjects.length * 100;
      const percentage = (totalMarksAll / maxPossible) * 100;
      result.sgpa = (percentage / 9.5).toFixed(2);
      result.cgpa = result.sgpa; // Simplified
    }
    
    await result.save();
    
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get results
// @route   GET /api/academic/results
// @access  Private
exports.getResults = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query = { student: req.user.id };
    }
    if (req.query.studentId) {
      query.student = req.query.studentId;
    }
    
    const results = await Result.find(query)
      .populate('student', 'name email rollNumber branch')
      .populate('exam', 'title type')
      .populate('subjects.subject', 'name code credits');
      
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};
