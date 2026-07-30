const Task = require('../models/Task');
const StudySession = require('../models/StudySession');

// --- TASK MANAGEMENT ---

// @desc    Get all tasks for user
// @route   GET /api/planner/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort('dueDate');
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/planner/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (e.g. mark complete)
// @route   PUT /api/planner/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/planner/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// --- STUDY SESSIONS & ANALYTICS ---

// @desc    Log a completed Pomodoro/Study Session
// @route   POST /api/planner/sessions
// @access  Private
exports.logStudySession = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const session = await StudySession.create(req.body);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

// @desc    Get study analytics (weekly hours, streak)
// @route   GET /api/planner/analytics
// @access  Private
exports.getStudyAnalytics = async (req, res, next) => {
  try {
    // Get all sessions
    const sessions = await StudySession.find({ user: req.user.id }).sort({ date: -1 });
    
    let totalMinutes = 0;
    
    // Aggregate by Day for the chart (last 7 days)
    const dayMap = {};
    const today = new Date();
    today.setHours(0,0,0,0);
    
    for (let i=6; i>=0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dayMap[d.toISOString().split('T')[0]] = 0;
    }

    sessions.forEach(s => {
      totalMinutes += s.durationMinutes;
      const dateStr = s.date.toISOString().split('T')[0];
      if (dayMap[dateStr] !== undefined) {
        dayMap[dateStr] += s.durationMinutes;
      }
    });

    const chartLabels = Object.keys(dayMap);
    const chartData = Object.values(dayMap).map(mins => Number((mins/60).toFixed(1))); // Convert to hours

    // Simple Streak Logic
    let streak = 0;
    let currentDate = new Date(today);
    
    const uniqueDatesSet = new Set(sessions.map(s => s.date.toISOString().split('T')[0]));
    
    // Check if studied today
    const todayStr = currentDate.toISOString().split('T')[0];
    if (uniqueDatesSet.has(todayStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // If didn't study today, check if studied yesterday to keep streak alive
      currentDate.setDate(currentDate.getDate() - 1);
      const yesterdayStr = currentDate.toISOString().split('T')[0];
      if (!uniqueDatesSet.has(yesterdayStr)) {
        // Did not study yesterday either, streak is 0
        currentDate = null; 
      }
    }

    while (currentDate) {
      const dStr = currentDate.toISOString().split('T')[0];
      if (uniqueDatesSet.has(dStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalHours: Number((totalMinutes / 60).toFixed(1)),
        streak,
        chart: {
          labels: chartLabels,
          data: chartData
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
