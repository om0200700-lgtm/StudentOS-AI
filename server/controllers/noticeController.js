const Notice = require('../models/Notice');

// @desc    Create new notice
// @route   POST /api/academic/notices
// @access  Private (Admin/Faculty)
exports.createNotice = async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    // Faculty can only post department notices
    if (req.user.role === 'faculty') {
      req.body.type = 'department';
    }
    const notice = await Notice.create(req.body);
    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all notices
// @route   GET /api/academic/notices
// @access  Private
exports.getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find().populate('author', 'name role').sort('-createdAt');
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notice
// @route   DELETE /api/academic/notices/:id
// @access  Private (Admin/Faculty)
exports.deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    
    // Check ownership or admin
    if (notice.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete' });
    }
    
    await notice.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
