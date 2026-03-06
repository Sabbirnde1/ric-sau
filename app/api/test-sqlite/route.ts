import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test connection by counting all tables
    const [
      userCount,
      newsCount,
      eventCount,
      projectCount,
      teamCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.news.count(),
      prisma.event.count(),
      prisma.project.count(),
      prisma.team.count(),
    ]);

    return NextResponse.json({
      success: true,
      message: '✅ SQLite connected successfully!',
      database: 'SQLite (dev.db)',
      tableStats: {
        users: userCount,
        news: newsCount,
        events: eventCount,
        projects: projectCount,
        team: teamCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: '❌ Database connection failed',
      error: error.message,
    }, { status: 500 });
  }
}
