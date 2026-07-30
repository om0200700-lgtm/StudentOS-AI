const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

async function setup() {
  await connectDB();

  // Clear existing users to prevent duplicates in tests
  await User.deleteMany({});

  // Seed Admin
  await User.create({
    name: 'Admin Test',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    isEmailVerified: true
  });

  // Seed Faculty
  await User.create({
    name: 'Faculty Test',
    email: 'faculty@test.com',
    password: 'password123',
    role: 'faculty',
    department: 'Computer Science',
    isEmailVerified: true
  });

  // Seed Student
  await User.create({
    name: 'Student Test',
    email: 'student@test.com',
    password: 'password123',
    role: 'student',
    branch: 'CSE',
    semester: 5,
    isEmailVerified: true
  });

  console.log('Test database seeded successfully');
  await mongoose.disconnect();
  
  if (global.__MONGO_INSTANCE) {
    await global.__MONGO_INSTANCE.stop();
  }
}

setup().catch(err => {
  console.error(err);
  process.exit(1);
});
