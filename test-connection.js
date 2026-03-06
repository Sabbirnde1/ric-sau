// Simple MongoDB connection test
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

console.log('Testing MongoDB connection...');
console.log('Connection string:', uri?.replace(/:[^:@]+@/, ':****@')); // Hide password

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 2,
});

async function testConnection() {
  try {
    console.log('\n🔄 Attempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully to MongoDB!');
    
    // Test database operation
    const db = client.db('ric-sau');
    const collections = await db.listCollections().toArray();
    console.log(`📂 Found ${collections.length} collections`);
    
    await client.close();
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    // Check specific error types
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('\n💡 SSL/TLS Error detected. This is likely due to:');
      console.log('   1. Node.js 24 compatibility issues (recommend using Node.js 20 LTS)');
      console.log('   2. Network/firewall blocking MongoDB Atlas');
      console.log('   3. MongoDB Atlas cluster might be paused or unavailable');
      console.log('\n🔧 Recommended fix: Install Node.js 20 LTS from https://nodejs.org/');
    }
    
    process.exit(1);
  }
}

testConnection();
