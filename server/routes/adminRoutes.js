const express = require('express');
const { getUsers, updateUserRole, updateUserStatus, getAdminStats, bulkUploadUsers, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply protect and authorize middleware to all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.post('/users/bulk', bulkUploadUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
