// Test local MongoDB connection
const { MongoClient } = require('mongodb');

// Try localhost connection
const localUri = 'mongodb://localhost:27017/ric-sau';

console.log('Testing local MongoDB connection...');

const client = new MongoClient(localUri, {
  serverSelectionTimeoutMS: 5000,
});

async function testConnection() {
  try {
    console.log('\n🔄 Attempting to connect to local MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully to local MongoDB!');
    
    const db = client.db('ric-sau');
    const collections = await db.listCollections().toArray();
    console.log(`📂 Found ${collections.length} collections`);
    
    await client.close();
    console.log('✅ Connection test completed successfully!');
    console.log('\n💡 Update your .env.local to use: mongodb://localhost:27017/ric-sau');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Local MongoDB not found. Install MongoDB:');
    console.log('   Option 1: Download from https://www.mongodb.com/try/download/community');
    console.log('   Option 2: Use Docker: docker run -d -p 27017:27017 --name mongodb mongo');
    console.log('   Option 3: Fix MongoDB Atlas connection issues');
    process.exit(1);
  }
}

testConnection();
