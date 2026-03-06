import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: '✅ MongoDB connected successfully!',
      database: mongoose.connection.db.databaseName,
      collections: collections.map(c => c.name),
      collectionsCount: collections.length,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: '❌ MongoDB connection failed',
      error: error.message,
    }, { status: 500 });
  }
}
