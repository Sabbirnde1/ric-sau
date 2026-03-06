import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;

export async function GET() {
  let client;
  
  try {
    // Use native MongoDB driver with minimal options
    client = new MongoClient(uri);
    
    await client.connect();
    
    const db = client.db('ric-sau');
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: '✅ MongoDB connected successfully with native driver!',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      collectionsCount: collections.length,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: '❌ MongoDB connection failed',
      error: error.message,
    }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
