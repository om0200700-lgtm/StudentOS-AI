const express = require('express');
const { uploadMark, getMarks } = require('../controllers/markController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMarks)
  .post(authorize('admin', 'faculty'), uploadMark);

module.exports = router;
