// @desc    Get dashboard statistics for faculty
// @route   GET /api/faculty/stats
// @access  Private/Faculty
exports.getFacultyStats = async (req, res, next) => {
  try {
    // Currently, there are no schemas for Classes or Assignments in the DB
    // We mock the counts to 0 so the UI renders successfully without errors.
    res.status(200).json({
      success: true,
      data: {
        classes: 0,
        pendingApprovals: 0,
        upcomingAssignments: 0
      }
    });
  } catch (error) {
    next(error);
  }
};
