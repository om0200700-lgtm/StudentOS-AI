const express = require('express');
const router = express.Router();
const { getAttendanceReport, getMarksReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/attendance', authorize('admin', 'faculty'), getAttendanceReport);
router.get('/marks', authorize('admin', 'faculty'), getMarksReport);

module.exports = router;
