const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Strict limiter for auth routes (login, register, forgot-password)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 auth attempts per 15 minutes per IP
  message: 'Too many authentication attempts. Please try again later.'
});

const isTest = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'test';

// Skip rate limiting in test environment to avoid breaking E2E tests
if (!isTest) {
  app.use('/api/', limiter);
}

// General Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Import cron jobs
const { initJobs } = require('./jobs/cronJobs');

// Route Files
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const cgpaRoutes = require('./routes/cgpaRoutes');
const plannerRoutes = require('./routes/plannerRoutes');
const codingRoutes = require('./routes/codingRoutes');
const placementRoutes = require('./routes/placementRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const goalRoutes = require('./routes/goalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const facultyRoutes = require('./routes/facultyRoutes');

// Academic Routes (Phase 12)
const subjectRoutes = require('./routes/subjectRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const classAttendanceRoutes = require('./routes/classAttendanceRoutes');
const markRoutes = require('./routes/markRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const resultRoutes = require('./routes/resultRoutes');

// College Admin Routes (Phase 13)
const departmentRoutes = require('./routes/departmentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Enterprise Routes (Phase 15)
const feeRoutes = require('./routes/feeRoutes');
const examRoutes = require('./routes/examRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const aiRoutes = require('./routes/aiRoutes');
const backupRoutes = require('./routes/backupRoutes');

const errorHandler = require('./middleware/errorHandler');

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'StudentOS AI API is running' });
});

// Mount routes
app.use('/api/auth', !isTest ? authLimiter : (req, res, next) => next(), authRoutes);
app.use('/api/attendance', attendanceRoutes); // Legacy
app.use('/api/cgpa', cgpaRoutes); // Legacy
app.use('/api/planner', plannerRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);

// Mount Academic Routes (Phase 12)
app.use('/api/academic/subjects', subjectRoutes);
app.use('/api/academic/notices', noticeRoutes);
app.use('/api/academic/attendance', classAttendanceRoutes);
app.use('/api/academic/marks', markRoutes);
app.use('/api/academic/timetable', timetableRoutes);
app.use('/api/academic/assignments', assignmentRoutes);
app.use('/api/academic/results', resultRoutes);

// Mount College Admin Routes (Phase 13)
app.use('/api/admin/departments', departmentRoutes);
app.use('/api/admin/courses', courseRoutes);
app.use('/api/admin/calendar', calendarRoutes);
app.use('/api/admin/reports', reportRoutes);

// Mount Enterprise Routes (Phase 15)
app.use('/api/fees', feeRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/backup', backupRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'ok', 
    uptime: process.uptime(),
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

if (process.env.NODE_ENV === 'test') {
  app.post('/api/test/seed', async (req, res) => {
    try {
      const User = require('./models/User');
      const Department = require('./models/Department');
      const Course = require('./models/Course');
      const AcademicCalendar = require('./models/AcademicCalendar');
      
      await User.deleteMany({});
      await Department.deleteMany({});
      await Course.deleteMany({});
      await AcademicCalendar.deleteMany({});
      
      await User.create({ name: 'Admin Test', email: 'admin@test.com', password: 'password123', role: 'admin', isEmailVerified: true });
      await User.create({ name: 'Faculty Test', email: 'faculty@test.com', password: 'password123', role: 'faculty', department: 'Computer Science', isEmailVerified: true });
      await User.create({ name: 'Student Test', email: 'student@test.com', password: 'password123', role: 'student', branch: 'CSE', semester: 5, isEmailVerified: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/test/debug', async (req, res) => {
    try {
      const User = require('./models/User');
      const users = await User.find({}).select('+password');
      const admin = await User.findOne({ email: 'admin@test.com' }).select('+password');
      let match = false;
      if (admin) {
        match = await admin.matchPassword('password123');
      }
      res.json({ users, adminHash: admin ? admin.password : null, match });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}

// Error Handler Middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  // Initialize scheduled tasks
  initJobs();
});
