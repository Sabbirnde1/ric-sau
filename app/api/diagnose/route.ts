import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Diagnostic Route for Netlify Login Issues
 * 
 * This route helps identify why login is not working on Netlify.
 * Visit: https://your-site.netlify.app/api/diagnose
 * 
 * After identifying the issue, you can delete this file.
 */

export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    checks: {},
    issues: [],
    solutions: []
  };

  try {
    // Check 1: Environment Variables
    diagnostics.checks.environmentVariables = {
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
      SETUP_SECRET: process.env.SETUP_SECRET ? '✅ Set' : '⚠️ Not set (optional)',
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || '⚠️ Using default'
    };

    if (!process.env.DATABASE_URL) {
      diagnostics.issues.push('DATABASE_URL environment variable is not set');
      diagnostics.solutions.push('Go to Netlify → Site settings → Environment variables → Add DATABASE_URL');
    }

    if (!process.env.JWT_SECRET) {
      diagnostics.issues.push('JWT_SECRET environment variable is not set');
      diagnostics.solutions.push('Go to Netlify → Site settings → Environment variables → Add JWT_SECRET');
    }

    // Check 2: Database Connection
    try {
      await prisma.$connect();
      diagnostics.checks.databaseConnection = '✅ Connected';
    } catch (dbError: any) {
      diagnostics.checks.databaseConnection = '❌ Connection failed';
      diagnostics.issues.push(`Database connection error: ${dbError.message}`);
      diagnostics.solutions.push('Verify DATABASE_URL is correct and database is accessible');
      
      return NextResponse.json({
        success: false,
        ...diagnostics,
        criticalError: 'Cannot connect to database'
      }, { status: 500 });
    }

    // Check 3: Database Tables Exist
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      diagnostics.checks.tablesExist = tables ? '✅ Tables found' : '❌ No tables';
      diagnostics.checks.tableList = tables;

      // Check if User table exists
      const hasUserTable = Array.isArray(tables) && 
        tables.some((t: any) => t.table_name === 'User' || t.table_name === 'user');
      
      if (!hasUserTable) {
        diagnostics.issues.push('User table does not exist in database');
        diagnostics.solutions.push('Run migrations: npx prisma migrate deploy');
      }
    } catch (error: any) {
      diagnostics.checks.tablesExist = '❌ Could not check tables';
      diagnostics.issues.push(`Table check error: ${error.message}`);
    }

    // Check 4: Users Exist
    try {
      const userCount = await prisma.user.count();
      diagnostics.checks.usersInDatabase = userCount > 0 
        ? `✅ ${userCount} user(s) found` 
        : '❌ No users in database';

      if (userCount === 0) {
        diagnostics.issues.push('No users in database - cannot login!');
        diagnostics.solutions.push('Initialize database by visiting: /api/setup-db?secret=YOUR_SETUP_SECRET');
        diagnostics.solutions.push('See DATABASE_SETUP.md for detailed instructions');
      } else {
        // Get admin user info (without password)
        const adminUser = await prisma.user.findFirst({
          where: { role: 'admin' },
          select: { id: true, username: true, email: true, role: true, createdAt: true }
        });
        
        if (adminUser) {
          diagnostics.checks.adminUser = {
            status: '✅ Admin user exists',
            username: adminUser.username,
            email: adminUser.email,
            createdAt: adminUser.createdAt
          };
        } else {
          diagnostics.checks.adminUser = '⚠️ No admin user found';
          diagnostics.issues.push('No admin user exists');
        }
      }
    } catch (error: any) {
      diagnostics.checks.usersInDatabase = '❌ Could not check users';
      diagnostics.issues.push(`User check error: ${error.message}`);
      
      if (error.code === 'P2021') {
        diagnostics.solutions.push('Tables are missing. Run: npx prisma migrate deploy');
      }
    }

    // Check 5: Settings Exist (for logo)
    try {
      const settingsCount = await prisma.settings.count();
      diagnostics.checks.settings = settingsCount > 0 
        ? '✅ Settings exist' 
        : '❌ No settings (logo won\'t show)';

      if (settingsCount === 0) {
        diagnostics.issues.push('No settings in database - logo and site config missing');
        diagnostics.solutions.push('Initialize database to create default settings');
      }
    } catch (error: any) {
      diagnostics.checks.settings = '⚠️ Could not check settings';
    }

    // Check 6: Prisma Client
    diagnostics.checks.prismaClient = '✅ Prisma client loaded';

    // Final Assessment
    if (diagnostics.issues.length === 0) {
      diagnostics.status = '✅ All checks passed! Login should work.';
      diagnostics.note = 'If login still fails, check browser console and Netlify function logs';
    } else {
      diagnostics.status = `❌ Found ${diagnostics.issues.length} issue(s) preventing login`;
    }

    // Disconnect
    await prisma.$disconnect();

    return NextResponse.json({
      success: diagnostics.issues.length === 0,
      ...diagnostics
    }, { status: diagnostics.issues.length === 0 ? 200 : 500 });

  } catch (error: any) {
    diagnostics.checks.error = '❌ Diagnostic failed';
    diagnostics.criticalError = error.message;
    diagnostics.stack = error.stack;

    return NextResponse.json({
      success: false,
      ...diagnostics,
      hint: 'Check Netlify function logs for detailed error information'
    }, { status: 500 });
  }
}
