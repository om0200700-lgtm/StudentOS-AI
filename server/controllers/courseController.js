const Course = require('../models/Course');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('department', 'name code');
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { name, code, department, totalSemesters, creditsRequired } = req.body;
    const existing = await Course.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Course code already exists' });
    }
    const course = await Course.create({ name, code, department, totalSemesters, creditsRequired });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
