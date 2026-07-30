const express = require('express');
const {
  getSemesters,
  addSemester,
  updateSemester,
  deleteSemester
} = require('../controllers/cgpaController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('student', 'admin')); // Protect all routes below

router.route('/')
  .get(getSemesters)
  .post(addSemester);

router.route('/:id')
  .put(updateSemester)
  .delete(deleteSemester);

module.exports = router;
