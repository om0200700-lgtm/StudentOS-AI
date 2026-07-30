const express = require('express');
const { createAssignment, getAssignments, submitAssignment, getSubmissions } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAssignments)
  .post(authorize('admin', 'faculty'), createAssignment);

router.route('/:id/submit')
  .post(authorize('student'), submitAssignment);

router.route('/:id/submissions')
  .get(authorize('admin', 'faculty'), getSubmissions);

module.exports = router;
