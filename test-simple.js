// Simplest MongoDB test with minimal options
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

// Simplified connection string (remove problematic SSL params)
const uri = 'mongodb+srv://sabbirhossainnde_db_user:nZJ8CjG5hojVoHXq@cluster0.imiqdza.mongodb.net/ric-sau?retryWrites=true&w=majority';

console.log('🚀 Trying simplified connection...\n');

const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log('✅ CONNECTED!\n');
    
    const db = client.db('ric-sau');
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections:`, collections.map(c => c.name).join(', '));
    
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

connect();
