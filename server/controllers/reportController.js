const User = require('../models/User');
const ClassAttendance = require('../models/ClassAttendance');
const Mark = require('../models/Mark');

exports.getAttendanceReport = async (req, res, next) => {
  try {
    const { department, semester, section } = req.query;
    let matchStage = {};
    
    if (department) matchStage.department = department;
    if (semester) matchStage.semester = parseInt(semester);
    if (section) matchStage.section = section;

    const report = await ClassAttendance.aggregate([
      { $match: matchStage },
      { $unwind: "$records" },
      {
        $group: {
          _id: { student: "$records.student", status: "$records.status" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.student",
          statuses: {
            $push: {
              k: "$_id.status",
              v: "$count"
            }
          }
        }
      },
      {
        $project: {
          studentId: "$_id",
          stats: { $arrayToObject: "$statuses" }
        }
      }
    ]);

    // Populate user info manually or with a $lookup
    const populatedReport = await User.populate(report, { path: 'studentId', select: 'name email rollNumber department semester section' });

    res.status(200).json({ success: true, data: populatedReport });
  } catch (error) {
    next(error);
  }
};

exports.getMarksReport = async (req, res, next) => {
  try {
    const { department, semester, examType } = req.query;
    let matchStage = {};
    if (semester) matchStage.semester = parseInt(semester);
    if (examType) matchStage.examType = examType;

    const report = await Mark.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$student",
          totalMarksObtained: { $sum: "$marksObtained" },
          totalMaxMarks: { $sum: "$maxMarks" },
          averagePercentage: { $avg: { $multiply: [ { $divide: ["$marksObtained", "$maxMarks"] }, 100 ] } }
        }
      },
      { $sort: { averagePercentage: -1 } }
    ]);

    const populatedReport = await User.populate(report, { path: '_id', select: 'name email rollNumber department semester section' });

    res.status(200).json({ success: true, data: populatedReport });
  } catch (error) {
    next(error);
  }
};
