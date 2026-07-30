const express = require('express');
const { createNotice, getNotices, deleteNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotices)
  .post(authorize('admin', 'faculty'), createNotice);

router.route('/:id')
  .delete(authorize('admin', 'faculty'), deleteNotice);

module.exports = router;
