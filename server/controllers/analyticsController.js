const Attendance = require('../models/Attendance');
const Semester = require('../models/Semester');
const Task = require('../models/Task');
const CodingProfile = require('../models/CodingProfile');
const PlacementPrep = require('../models/PlacementPrep');
const Goal = require('../models/Goal');
const Notification = require('../models/Notification');

exports.getDashboardOverview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all related data concurrently
    const [
      attendances,
      cgpaDocs,
      tasks,
      codingProfile,
      placementPrep,
      goals,
      notifications
    ] = await Promise.all([
      Attendance.find({ user: userId }),
      Semester.find({ user: userId }),
      Task.find({ user: userId }),
      CodingProfile.findOne({ user: userId }),
      PlacementPrep.findOne({ user: userId }),
      Goal.find({ user: userId, status: { $ne: 'completed' } }).limit(5).sort('deadline'),
      Notification.find({ user: userId, isRead: false }).limit(5).sort('-createdAt')
    ]);

    // --- Calculate Stats ---
    
    // 1. Attendance percentage
    let totalAttended = 0;
    let totalClasses = 0;
    attendances.forEach(a => {
      totalAttended += a.attendedClasses;
      totalClasses += a.totalClasses;
    });
    const attendancePercentage = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(1) : 0;

    // 2. CGPA
    let currentCgpa = 0;
    if (cgpaDocs.length > 0) {
      let totalPoints = 0;
      let totalCredits = 0;
      cgpaDocs.forEach(sem => {
        sem.subjects.forEach(sub => {
          totalPoints += sub.gradePoint * sub.credits;
          totalCredits += sub.credits;
        });
      });
      currentCgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    }

    // 3. Coding Streak & Tasks
    const codingStreak = codingProfile ? codingProfile.dailyStreak : 0;
    const completedTasks = tasks.filter(t => t.completed).length;

    // 4. Placement Readiness
    const placementReadiness = placementPrep ? placementPrep.overallReadiness : 0;

    // 5. Study Hours (Mock calculation from Tasks for chart)
    const studyHoursData = [
      { name: 'Mon', hours: 2 },
      { name: 'Tue', hours: 3 },
      { name: 'Wed', hours: 4 },
      { name: 'Thu', hours: 3 },
      { name: 'Fri', hours: 5 },
      { name: 'Sat', hours: 2 },
      { name: 'Sun', hours: 6 }
    ];

    const gpaTrendData = [
      { sem: 'Sem 1', sgpa: 8.2 },
      { sem: 'Sem 2', sgpa: 8.4 },
      { sem: 'Sem 3', sgpa: 8.1 },
      { sem: 'Sem 4', sgpa: Math.max(8.0, currentCgpa - 0.2) },
      { sem: 'Sem 5', sgpa: currentCgpa || 8.5 }
    ];

    const attendanceData = {
      labels: ['Present', 'Absent'],
      datasets: [{
        data: [attendancePercentage, Math.max(0, 100 - attendancePercentage)],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(244, 63, 94, 0.8)'],
        borderWidth: 0,
      }]
    };

    // Smart Recommendations (AI Assistant)
    const recommendations = [];
    if (attendancePercentage > 0 && attendancePercentage < 75) {
      recommendations.push({ text: 'Warning: Overall attendance is below 75%. Focus on attending upcoming lectures.', type: 'danger' });
    }
    if (currentCgpa > 0 && currentCgpa < 7.5) {
      recommendations.push({ text: 'CGPA is below 7.5. Consider dedicating more time to core subjects.', type: 'warning' });
    }
    if (codingStreak === 0) {
      recommendations.push({ text: 'You have no active coding streak. Try solving 1 LeetCode problem today.', type: 'info' });
    }
    if (placementReadiness < 50) {
      recommendations.push({ text: 'Your placement preparation is lagging. Update your resume and skills.', type: 'info' });
    }
    if (recommendations.length === 0) {
      recommendations.push({ text: 'You are on track! Keep up the excellent work.', type: 'success' });
    }

    const payload = {
      stats: {
        cgpa: parseFloat(currentCgpa),
        attendance: parseFloat(attendancePercentage),
        codingStreak,
        studyHours: 25, // Mocked total
        placementReadiness,
        tasksCompleted: completedTasks
      },
      studyHoursData,
      gpaTrendData,
      attendanceData,
      goals: goals.map(g => ({ id: g._id, text: g.title, completed: g.status === 'completed' })),
      notifications: notifications.map(n => ({ id: n._id, text: n.message, time: 'New', type: n.type })),
      upcomingEvents: [], // Would map from a calendar model
      aiRecommendations: recommendations
    };

    res.status(200).json({
      success: true,
      data: payload
    });
  } catch (error) {
    next(error);
  }
};
