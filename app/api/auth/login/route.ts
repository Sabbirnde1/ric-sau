import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check database connection
    try {
      await prisma.$connect();
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed',
          hint: 'Check DATABASE_URL environment variable',
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        },
        { status: 500 }
      );
    }
    
    // Find user by username
    let user;
    try {
      user = await prisma.user.findUnique({ where: { username } });
    } catch (queryError: any) {
      console.error('Database query error:', queryError);
      
      // Check if it's a missing table error
      if (queryError.code === 'P2021' || queryError.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Database not initialized',
            hint: 'Visit /api/setup-db?secret=YOUR_SETUP_SECRET to initialize',
            documentation: 'See DATABASE_SETUP.md for instructions'
          },
          { status: 500 }
        );
      }
      
      throw queryError;
    }
    
    if (!user) {
      console.log(`Login attempt failed: User '${username}' not found`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid username or password',
          hint: 'If this is a fresh deployment, initialize database first at /api/diagnose'
        },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`Login attempt failed: Invalid password for user '${username}'`);
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    console.log(`Login successful: User '${username}' logged in`);
    
    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id.toString(), 
        username: user.username, 
        email: user.email,
        role: user.role 
      }
    });
    
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Authentication failed',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        hint: 'Visit /api/diagnose for detailed diagnostics'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
