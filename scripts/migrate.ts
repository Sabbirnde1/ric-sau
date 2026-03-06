/**
 * MongoDB Database Migration Script
 * 
 * This script migrates mock data from the API routes to MongoDB database.
 * Run this once after setting up your MongoDB connection.
 * 
 * Usage: npm run migrate
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Connection
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not defined in .env.local');
  console.log('Please create a .env.local file with your MongoDB connection string.');
  process.exit(1);
}

// Import models
async function importModels() {
  const { default: User } = await import('../lib/models/User');
  const { default: Project } = await import('../lib/models/Project');
  const { default: News } = await import('../lib/models/News');
  const { default: Event } = await import('../lib/models/Event');
  const { default: Team } = await import('../lib/models/Team');
  const { default: Innovator } = await import('../lib/models/Innovator');
  const { default: RlCommittee } = await import('../lib/models/RlCommittee');
  const { default: Home } = await import('../lib/models/Home');
  const { default: About } = await import('../lib/models/About');
  const { default: Contact } = await import('../lib/models/Contact');
  const { default: Settings } = await import('../lib/models/Settings');
  
  return { User, Project, News, Event, Team, Innovator, RlCommittee, Home, About, Contact, Settings };
}

// Mock data to migrate
const mockData = {
  home: {
    hero: {
      title: 'Research & Innovation Center',
      subtitle: 'Sher-e-Bangla Agricultural University',
      description: 'Pioneering Agricultural Research & Technology Innovation',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    stats: [
      { label: 'Research Projects', value: '50+' },
      { label: 'Publications', value: '200+' },
      { label: 'Researchers', value: '100+' },
      { label: 'Partners', value: '30+' }
    ]
  },
  about: {
    mission: 'To advance agricultural research and innovation for sustainable development',
    vision: 'To be a leading research center in agricultural technology and innovation',
    description: 'The Research & Innovation Center (RIC-SAU) is dedicated to advancing agricultural research and technology innovation.',
    established: '2020',
    achievements: [
      'Over 200 research publications',
      '50+ ongoing research projects',
      'International partnerships with leading institutions'
    ]
  },
  contact: {
    address: '4th Floor, Central Library, Sher-e-Bangla Agricultural University, Dhaka-1207, Bangladesh',
    phone: '+880244814019',
    email: 'info.sauric@gmail.com',
    officeHours: 'Sunday - Thursday: 9:00 AM - 5:00 PM'
  },
  settings: {
    general: {
      siteName: 'Research & Innovation Center - SAU',
      tagline: 'Pioneering Agricultural Research & Technology Innovation',
      description: 'The Research & Innovation Center (RIC-SAU) is dedicated to advancing agricultural research and technology innovation.',
      logo: '/logo.png',
      favicon: '/favicon.ico',
      footerText: 'Made with ❤️ for Research & Innovation'
    },
    seo: {
      metaTitle: 'Research & Innovation Center | Sher-e-Bangla Agricultural University',
      metaDescription: 'Leading research center for agricultural innovation and technology at Sher-e-Bangla Agricultural University, Dhaka, Bangladesh.',
      metaKeywords: 'research, innovation, agriculture, SAU, technology, Bangladesh',
      ogImage: '/og-image.jpg'
    },
    social: {
      facebook: 'https://facebook.com/sauric',
      twitter: 'https://twitter.com/sauric',
      linkedin: 'https://linkedin.com/company/sauric',
      youtube: 'https://youtube.com/@sauric',
      instagram: 'https://instagram.com/sauric'
    },
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      accentColor: '#F59E0B',
      darkMode: false
    },
    features: {
      showNewsletterSignup: true,
      showVideoModal: true,
      enableComments: false,
      enableSearching: true,
      maintenanceMode: false
    }
  }
};

async function migrate() {
  try {
    console.log('🚀 Starting MongoDB migration...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Import models
    const models = await importModels();
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await models.User.deleteMany({});
    const admin = await models.User.create({
      username: 'admin',
      email: 'admin@ric-sau.edu.bd',
      password: hashedPassword,
      role: 'admin'
    });
    console.log(`✓ Admin user created: ${admin.username}\n`);
    
    // Migrate Home data
    console.log('🏠 Migrating home data...');
    await models.Home.deleteMany({});
    await models.Home.create(mockData.home);
    console.log('✓ Home data migrated\n');
    
    // Migrate About data
    console.log('ℹ️  Migrating about data...');
    await models.About.deleteMany({});
    await models.About.create(mockData.about);
    console.log('✓ About data migrated\n');
    
    // Migrate Contact data
    console.log('📞 Migrating contact data...');
    await models.Contact.deleteMany({});
    await models.Contact.create(mockData.contact);
    console.log('✓ Contact data migrated\n');
    
    // Migrate Settings
    console.log('⚙️  Migrating settings...');
    await models.Settings.deleteMany({});
    await models.Settings.create(mockData.settings);
    console.log('✓ Settings migrated\n');
    
    // Note: Projects, News, Events, Team, etc. can be added via the dashboard
    console.log('📝 Note: Projects, News, Events, Team members, etc. should be added via the dashboard UI\n');
    
    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  - 1 admin user created');
    console.log('  - Home page data migrated');
    console.log('  - About page data migrated');
    console.log('  - Contact information migrated');
    console.log('  - Site settings migrated');
    console.log('\n🎯 Next steps:');
    console.log('  1. Start your development server: npm run dev');
    console.log('  2. Login with: username=admin, password=admin123');
    console.log('  3. Add content via the dashboard');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run migration
migrate();
