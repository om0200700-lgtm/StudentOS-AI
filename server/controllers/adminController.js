const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.department) filters.department = req.query.department;
    if (req.query.semester) filters.semester = req.query.semester;
    if (req.query.section) filters.section = req.query.section;
    if (req.query.batch) filters.batch = req.query.batch;

    const users = await User.find(filters).select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Enable/Disable user
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Prevent admin from disabling themselves
    if (user._id.toString() === req.user.id && status === 'disabled') {
      return res.status(400).json({ success: false, message: 'You cannot disable your own admin account' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeStudents = await User.countDocuments({ role: 'student', status: 'active' });
    const activeFaculty = await User.countDocuments({ role: 'faculty', status: 'active' });

    const Department = require('../models/Department');
    const Course = require('../models/Course');
    const Subject = require('../models/Subject');

    const totalDepartments = await Department.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalSubjects = await Subject.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeStudents,
        activeFaculty,
        totalDepartments,
        totalCourses,
        totalSubjects
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk upload users via CSV data
// @route   POST /api/admin/users/bulk
// @access  Private/Admin
exports.bulkUploadUsers = async (req, res, next) => {
  try {
    const { users } = req.body;
    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }
    
    const results = { successful: 0, failed: 0, errors: [] };
    
    for (let u of users) {
      try {
        const existing = await User.findOne({ email: u.email });
        if (existing) {
          results.failed++;
          results.errors.push(`${u.email} already exists.`);
          continue;
        }
        await User.create({
          name: u.name,
          email: u.email,
          password: u.password || 'Student@123',
          role: u.role || 'student',
          department: u.department || '',
          semester: u.semester || 1,
          section: u.section || 'A',
          batch: u.batch || '',
          rollNumber: u.rollNumber || ''
        });
        results.successful++;
      } catch (err) {
        results.failed++;
        results.errors.push(`Failed for ${u.email}: ${err.message}`);
      }
    }
    
    res.status(201).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
