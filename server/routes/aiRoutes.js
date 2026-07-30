const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const aiController = require('../controllers/aiController');

// All AI routes require authentication
router.use(protect);

router.post('/chat', aiController.chat);
router.post('/study-plan', aiController.generateStudyPlan);
router.get('/predict', aiController.predictPerformance);

module.exports = router;
