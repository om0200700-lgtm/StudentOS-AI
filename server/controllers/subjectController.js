const Subject = require('../models/Subject');

// @desc    Create new subject
// @route   POST /api/academic/subjects
// @access  Private (Admin)
exports.createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subjects
// @route   GET /api/academic/subjects
// @access  Private
exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find().populate('faculty', 'name email');
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subject
// @route   PUT /api/academic/subjects/:id
// @access  Private (Admin)
exports.updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subject
// @route   DELETE /api/academic/subjects/:id
// @access  Private (Admin)
exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
