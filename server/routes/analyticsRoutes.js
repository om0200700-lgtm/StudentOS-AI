const express = require('express');
const { getDashboardOverview } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, getDashboardOverview);

module.exports = router;
