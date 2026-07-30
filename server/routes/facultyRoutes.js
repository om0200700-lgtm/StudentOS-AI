const express = require('express');
const { getFacultyStats } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('faculty', 'admin'));

router.get('/stats', getFacultyStats);

module.exports = router;
