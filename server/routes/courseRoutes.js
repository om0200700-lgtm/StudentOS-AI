const express = require('express');
const router = express.Router();
const { getCourses, createCourse, deleteCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getCourses);
router.post('/', authorize('admin'), createCourse);
router.delete('/:id', authorize('admin'), deleteCourse);

module.exports = router;
