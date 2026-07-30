const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

async function test() {
  try {
    const dbPath = path.join(__dirname, '.mongo-data');
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }

    console.log("Starting mongo server at", dbPath);
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath: dbPath,
      }
    });
    
    console.log("URI:", mongoServer.getUri());
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

test();
