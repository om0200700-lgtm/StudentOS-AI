const express = require('express');
const { markAttendance, getAttendance } = require('../controllers/classAttendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAttendance)
  .post(authorize('admin', 'faculty'), markAttendance);

module.exports = router;
