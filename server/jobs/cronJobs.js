const cron = require('node-cron');
// In a real application, you would require models here to query DB
// const Fee = require('../models/Fee');
// const Attendance = require('../models/Attendance');

// This file sets up scheduled tasks for the smart notification engine.

const initJobs = () => {
  // Do not run cron jobs in test environment
  if (process.env.NODE_ENV === 'test') {
    console.log('Cron jobs disabled in test environment.');
    return;
  }

  // Run every day at 8:00 AM to check for pending fees
  cron.schedule('0 8 * * *', async () => {
    console.log('[Cron] Checking for pending fees...');
    try {
      // Mocked logic: find pending fees due within 7 days
      // const upcomingFees = await Fee.find({ status: 'Pending', dueDate: { $lte: nextWeek } });
      // sendEmail or create notification
      console.log('[Cron] Fee reminder job completed.');
    } catch (error) {
      console.error('[Cron Error] Fee check failed', error);
    }
  });

  // Run every Friday at 5:00 PM to check for low attendance
  cron.schedule('0 17 * * 5', async () => {
    console.log('[Cron] Checking for low attendance...');
    try {
      // Mocked logic: find students with attendance < 75%
      // const lowAttendance = await Attendance.find({ percentage: { $lt: 75 } });
      // notify students
      console.log('[Cron] Low attendance check completed.');
    } catch (error) {
      console.error('[Cron Error] Attendance check failed', error);
    }
  });
  
  console.log('Cron jobs initialized successfully.');
};

module.exports = { initJobs };
