const Attendance = require('../models/Attendance');

// @desc    Get all subjects attendance for logged in user
// @route   GET /api/attendance
// @access  Private
exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await Attendance.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new subject
// @route   POST /api/attendance
// @access  Private
exports.addSubject = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const subject = await Attendance.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subject (e.g. rename, change target)
// @route   PUT /api/attendance/:id
// @access  Private
exports.updateSubject = async (req, res, next) => {
  try {
    let subject = await Attendance.findById(req.params.id);

    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    if (subject.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

    subject = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a subject
// @route   DELETE /api/attendance/:id
// @access  Private
exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Attendance.findById(req.params.id);

    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    if (subject.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

    await subject.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Log attendance (present/absent/cancelled)
// @route   POST /api/attendance/:id/log
// @access  Private
exports.logAttendance = async (req, res, next) => {
  try {
    const { status } = req.body; // 'present', 'absent', 'cancelled'
    const subject = await Attendance.findById(req.params.id);

    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    if (subject.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

    if (status === 'present') {
      subject.totalClasses += 1;
      subject.attendedClasses += 1;
    } else if (status === 'absent') {
      subject.totalClasses += 1;
    } // cancelled does not affect counts

    subject.logs.push({ status, date: new Date() });
    await subject.save();

    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};
