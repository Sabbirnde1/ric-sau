import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * Database Setup API Route
 * 
 * This route initializes the database with default data including:
 * - Admin user
 * - Sample content
 * - Settings (including logo)
 * 
 * SECURITY: Only run this ONCE after deployment!
 * After setup, you should disable this route or add authentication.
 * 
 * How to use:
 * 1. Deploy to Netlify
 * 2. Visit: https://your-site.netlify.app/api/setup-db?secret=YOUR_SETUP_SECRET
 * 3. Set SETUP_SECRET in Netlify environment variables
 */

export async function GET(request: NextRequest) {
  try {
    // Security: Check for setup secret
    const secret = request.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.SETUP_SECRET || 'change-this-secret-in-production';
    
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Invalid setup secret.' },
        { status: 401 }
      );
    }

    // Check if database is already initialized
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database already initialized. Already has users.',
        tip: 'To reinitialize, delete all data first or use a fresh database.'
      }, { status: 400 });
    }

    console.log('🌱 Starting database setup...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@ric-sau.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('✅ Created admin user');

    // Create settings with logo
    const settings = await prisma.settings.create({
      data: {
        general: JSON.stringify({
          siteName: 'RIC-SAU',
          tagline: 'Research & Innovation Centre - Sher-e-Bangla Agricultural University',
          description: 'Leading research and innovation at Sher-e-Bangla Agricultural University',
          footerText: '© 2026 Research & Innovation Centre, SAU. All rights reserved.',
          logo: 'https://via.placeholder.com/150x50/3B82F6/ffffff?text=RIC-SAU', // Default logo
        }),
        seo: JSON.stringify({
          metaTitle: 'RIC-SAU | Research & Innovation Centre',
          metaDescription: 'Fostering innovation and research excellence at SAU',
          metaKeywords: 'research, innovation, SAU, university, agriculture, technology',
        }),
        social: JSON.stringify({
          facebook: 'https://facebook.com/ric-sau',
          twitter: 'https://twitter.com/ric_sau',
          linkedin: 'https://linkedin.com/company/ric-sau',
          youtube: 'https://youtube.com/@ric-sau',
        }),
        theme: JSON.stringify({
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          accentColor: '#F59E0B',
          darkMode: false,
        }),
        features: JSON.stringify({
          showNewsletterSignup: true,
          showVideoModal: true,
          enableComments: false,
          enableSearching: true,
          maintenanceMode: false,
        }),
      },
    });
    console.log('✅ Created settings with logo');

    // Create home page data
    const home = await prisma.home.create({
      data: {
        hero: JSON.stringify({
          title: 'Research & Innovation Center',
          subtitle: 'Sher-e-Bangla Agricultural University',
          description: 'Pioneering Agricultural Research & Technology Innovation',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        }),
        stats: JSON.stringify([
          { label: 'Active Projects', value: '25+' },
          { label: 'Researchers', value: '50+' },
          { label: 'Publications', value: '100+' },
          { label: 'Partners', value: '15+' },
        ]),
      },
    });
    console.log('✅ Created home page');

    // Create about page
    const about = await prisma.about.create({
      data: {
        mission: 'To foster innovation and research excellence in agricultural sciences',
        vision: 'To become a leading research center in agricultural innovation',
        description: 'The Research & Innovation Center (RIC) at Sher-e-Bangla Agricultural University is dedicated to advancing agricultural knowledge through cutting-edge research.',
        established: '2020',
        achievements: JSON.stringify([
          'Over 100 research publications',
          '25+ active agricultural projects',
          '15+ industry partnerships',
          '50+ dedicated researchers',
        ]),
      },
    });
    console.log('✅ Created about page');

    // Create contact info
    const contact = await prisma.contact.create({
      data: {
        address: '4th Floor, Central Library, Sher-e-Bangla Agricultural University, Dhaka-1207, Bangladesh',
        phone: '+880244814019',
        email: 'info.sauric@gmail.com',
        officeHours: 'Sunday - Thursday: 9:00 AM - 5:00 PM',
      },
    });
    console.log('✅ Created contact info');

    // Create sample news
    const news = await prisma.news.create({
      data: {
        title: 'Welcome to RIC-SAU',
        slug: 'welcome-to-ric-sau',
        excerpt: 'Research & Innovation Center officially launched at Sher-e-Bangla Agricultural University',
        content: 'We are excited to announce the official launch of the Research & Innovation Center at SAU. Our mission is to drive agricultural innovation and research excellence.',
        date: new Date().toISOString().split('T')[0],
        category: 'Announcement',
        author: 'Admin',
        readTime: '2 min read',
      },
    });
    console.log('✅ Created sample news');

    // Create sample event
    const event = await prisma.event.create({
      data: {
        slug: 'agricultural-innovation-summit-2026',
        title: 'Agricultural Innovation Summit 2026',
        description: 'Join us for an exciting summit on agricultural innovation and sustainable farming practices.',
        date: '2026-04-15',
        time: '10:00 AM',
        location: 'SAU Campus, Main Auditorium',
        category: 'Conference',
      },
    });
    console.log('✅ Created sample event');

    return NextResponse.json({
      success: true,
      message: '✅ Database setup completed successfully!',
      data: {
        adminCreated: true,
        defaultCredentials: {
          username: 'admin',
          email: 'admin@ric-sau.com',
          password: 'admin123',
          note: '⚠️ CHANGE THIS PASSWORD IMMEDIATELY after first login!'
        },
        contentCreated: {
          settings: true,
          logo: 'Default placeholder logo added',
          home: true,
          about: true,
          contact: true,
          sampleNews: 1,
          sampleEvent: 1,
        },
        nextSteps: [
          '1. Login at /login with username: admin, password: admin123',
          '2. IMMEDIATELY change your password',
          '3. Go to Settings tab in dashboard to upload your actual logo',
          '4. Update site information in Settings',
          '5. Add your content (news, events, team, projects)',
          '6. IMPORTANT: Disable or remove this /api/setup-db route for security'
        ]
      }
    });

  } catch (error: any) {
    console.error('❌ Database setup error:', error);
    
    // Check if it's a Prisma migration error
    if (error.code === 'P2021' || error.message?.includes('table')) {
      return NextResponse.json({
        success: false,
        error: 'Database tables not created. Please run migrations first.',
        solution: 'Run: npx prisma migrate deploy',
        documentation: 'See NETLIFY_DEPLOYMENT.md for detailed instructions'
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Database setup failed',
      details: error.message,
      solution: 'Check Netlify logs for detailed error information'
    }, { status: 500 });
  }
}
