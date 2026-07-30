const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    let connected = false;
    let conn = null;

    if (uri) {
      try {
        conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        connected = true;
      } catch (e) {
        console.warn(`Could not connect to provided MONGODB_URI. Falling back to persistent embedded MongoDB.`);
      }
    }
    
    if (!connected) {
      console.warn('WARNING: MONGODB_URI not set or failed. Attempting embedded MongoDB (dev/test only).');
      let MongoMemoryServer;
      try {
        MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
      } catch (e) {
        console.error('FATAL: MONGODB_URI is not set and mongodb-memory-server is not installed.');
        console.error('Set MONGODB_URI in your .env file to connect to a real MongoDB instance.');
        process.exit(1);
      }
      
      const dbPath = path.join(__dirname, '..', '.mongo-data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      // Check if instance already running
      if (!global.__MONGO_INSTANCE) {
        global.__MONGO_INSTANCE = await MongoMemoryServer.create({
          instance: {
            dbPath: dbPath,
          }
        });
      }
      
      uri = global.__MONGO_INSTANCE.getUri();
      conn = await mongoose.connect(uri);
      console.log(`Embedded MongoDB Connected: ${conn.connection.host}`);
    }
    
    // Default Admin Creation
    try {
      const User = require('../models/User');
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@studentos.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
      
      let adminUser = await User.findOne({ email: adminEmail });
      
      if (!adminUser) {
        await User.create({
          name: 'System Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
          provider: 'email'
        });
        console.log(`Default admin account created: ${adminEmail}`);
      }
      
      // Migrate legacy 'user' roles to 'student'
      const legacyUsers = await User.updateMany(
        { role: 'user' },
        { $set: { role: 'student' } },
        { strict: false } // Bypasses validation if necessary, though updateMany usually bypasses enum checks
      );
      if (legacyUsers.modifiedCount > 0) {
        console.log(`Migrated ${legacyUsers.modifiedCount} legacy users to 'student' role.`);
      }
      
    } catch (seedError) {
      console.error('Failed to seed default admin or migrate users:', seedError.message);
    }

    return conn;
  } catch (error) {
    console.error(`Fatal error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
