const express = require('express');
const { getNotifications, markAsRead, deleteNotification, markAllAsRead } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('student', 'admin', 'faculty')); // All notification routes are protected

router.route('/')
  .get(getNotifications);

router.route('/read-all')
  .put(markAllAsRead);

router.route('/:id/read')
  .put(markAsRead);

router.route('/:id')
  .delete(deleteNotification);

module.exports = router;
