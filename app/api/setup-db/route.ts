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
 * 1. Deploy to your hosting provider (Vercel/Netlify)
 * 2. Visit: https://your-site.example.com/api/setup-db?secret=YOUR_SETUP_SECRET
 * 3. Set SETUP_SECRET in your deployment environment variables
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

    console.log('🌱 Starting database setup / refresh...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        email: 'admin@ric-sau.com',
        password: hashedPassword,
        role: 'admin',
      },
      create: {
        username: 'admin',
        email: 'admin@ric-sau.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('✅ Refreshed admin user');

    // Create settings with logo
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        general: JSON.stringify({
          siteName: 'RIC-SAU',
          tagline: 'Research & Innovation Centre - Sher-e-Bangla Agricultural University',
          description: 'Leading research and innovation at Sher-e-Bangla Agricultural University',
          footerText: '© 2026 Research & Innovation Centre, SAU. All rights reserved.',
          logo: '/RIC SAU logo.png',
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
      create: {
        general: JSON.stringify({
          siteName: 'RIC-SAU',
          tagline: 'Research & Innovation Centre - Sher-e-Bangla Agricultural University',
          description: 'Leading research and innovation at Sher-e-Bangla Agricultural University',
          footerText: '© 2026 Research & Innovation Centre, SAU. All rights reserved.',
          logo: '/RIC SAU logo.png',
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
    console.log('✅ Refreshed settings with logo');

    // Create home page data
    const home = await prisma.home.upsert({
      where: { id: 1 },
      update: {
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
      create: {
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
    console.log('✅ Refreshed home page');

    // Create about page
    const about = await prisma.about.upsert({
      where: { id: 1 },
      update: {
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
      create: {
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
    console.log('✅ Refreshed about page');

    // Create contact info
    const contact = await prisma.contact.upsert({
      where: { id: 1 },
      update: {
        address: '4th Floor, Central Library, Sher-e-Bangla Agricultural University, Dhaka-1207, Bangladesh',
        phone: '+880244814019',
        email: 'info.sauric@gmail.com',
        officeHours: 'Sunday - Thursday: 9:00 AM - 5:00 PM',
      },
      create: {
        address: '4th Floor, Central Library, Sher-e-Bangla Agricultural University, Dhaka-1207, Bangladesh',
        phone: '+880244814019',
        email: 'info.sauric@gmail.com',
        officeHours: 'Sunday - Thursday: 9:00 AM - 5:00 PM',
      },
    });
    console.log('✅ Refreshed contact info');

    // Create sample news
    const news = await prisma.news.upsert({
      where: { slug: 'welcome-to-ric-sau' },
      update: {
        title: 'Welcome to RIC-SAU',
        slug: 'welcome-to-ric-sau',
        excerpt: 'Research & Innovation Center officially launched at Sher-e-Bangla Agricultural University',
        content: 'We are excited to announce the official launch of the Research & Innovation Center at SAU. Our mission is to drive agricultural innovation and research excellence.',
        date: new Date().toISOString().split('T')[0],
        category: 'Announcement',
        author: 'Admin',
        readTime: '2 min read',
      },
      create: {
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
    console.log('✅ Refreshed sample news');

    // Create sample event
    const event = await prisma.event.upsert({
      where: { slug: 'agricultural-innovation-summit-2026' },
      update: {
        slug: 'agricultural-innovation-summit-2026',
        title: 'Agricultural Innovation Summit 2026',
        description: 'Join us for an exciting summit on agricultural innovation and sustainable farming practices.',
        date: '2026-04-15',
        time: '10:00 AM',
        location: 'SAU Campus, Main Auditorium',
        category: 'Conference',
      },
      create: {
        slug: 'agricultural-innovation-summit-2026',
        title: 'Agricultural Innovation Summit 2026',
        description: 'Join us for an exciting summit on agricultural innovation and sustainable farming practices.',
        date: '2026-04-15',
        time: '10:00 AM',
        location: 'SAU Campus, Main Auditorium',
        category: 'Conference',
      },
    });
    console.log('✅ Refreshed sample event');

    return NextResponse.json({
      success: true,
      message: '✅ Database setup completed successfully!',
      data: {
        adminCreated: true,
        defaultCredentials: {
          username: 'admin',
          note: '⚠️ Default password is admin123 — CHANGE THIS IMMEDIATELY after first login!'
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
        documentation: 'See deployment documentation for detailed instructions'
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Database setup failed',
      details: error.message,
      solution: 'Check deployment function logs for detailed error information'
    }, { status: 500 });
  }
}
