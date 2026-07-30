const express = require('express');
const {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  logAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('student', 'admin')); // Protect all routes below

router.route('/')
  .get(getSubjects)
  .post(addSubject);

router.route('/:id')
  .put(updateSubject)
  .delete(deleteSubject);

router.post('/:id/log', logAttendance);

module.exports = router;
