const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  logStudySession,
  getStudyAnalytics
} = require('../controllers/plannerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('student', 'admin')); // Protect all routes

// Task routes
router.route('/tasks')
  .get(getTasks)
  .post(createTask);

router.route('/tasks/:id')
  .put(updateTask)
  .delete(deleteTask);

// Session and Analytics routes
router.post('/sessions', logStudySession);
router.get('/analytics', getStudyAnalytics);

module.exports = router;
