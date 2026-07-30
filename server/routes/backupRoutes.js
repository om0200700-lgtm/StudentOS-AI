const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const backupController = require('../controllers/backupController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const admin = authorize('admin');

// All backup routes require Admin authentication
router.use(protect, admin);

router.get('/export', backupController.exportBackup);
router.post('/import', upload.single('backup'), backupController.importBackup);

module.exports = router;
