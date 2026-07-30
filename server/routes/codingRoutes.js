const express = require('express');
const { getProfile, updateProfile } = require('../controllers/codingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('student', 'admin'));

router.route('/')
  .get(getProfile)
  .put(updateProfile);

module.exports = router;
