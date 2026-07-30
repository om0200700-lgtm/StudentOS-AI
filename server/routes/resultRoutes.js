const express = require('express');
const { calculateResult, getResults } = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getResults);

router.route('/calculate')
  .post(authorize('admin', 'faculty'), calculateResult);

module.exports = router;
