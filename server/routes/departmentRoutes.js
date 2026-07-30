const express = require('express');
const router = express.Router();
const { getDepartments, createDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getDepartments);
router.post('/', authorize('admin'), createDepartment);
router.delete('/:id', authorize('admin'), deleteDepartment);

module.exports = router;
