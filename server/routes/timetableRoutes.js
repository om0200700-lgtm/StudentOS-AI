const express = require('express');
const { createTimetable, getTimetable } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTimetable)
  .post(authorize('admin', 'faculty'), createTimetable);

module.exports = router;
