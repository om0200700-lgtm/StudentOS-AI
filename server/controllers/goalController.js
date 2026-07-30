const Goal = require('../models/Goal');

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
exports.getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: goals.length, data: goals });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
exports.createGoal = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const goal = await Goal.create(req.body);
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
exports.updateGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this goal' });
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this goal' });
    }

    await goal.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
