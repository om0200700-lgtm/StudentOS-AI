const express = require('express');
const { getPrep, updatePrep } = require('../controllers/placementController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('student', 'admin'));

router.route('/')
  .get(getPrep)
  .put(updatePrep);

module.exports = router;
