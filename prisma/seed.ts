import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...\n');

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
  console.log('✅ Created admin user:', admin.email);

  // Create sample news
  const news1 = await prisma.news.create({
    data: {
      title: 'Welcome to RIC-SAU',
      slug: 'welcome-to-ric-sau',
      excerpt: 'Shahjalal University of Science and Technology Research & Innovation Centre',
      content: 'Welcome to the Research & Innovation Centre at SUST. We are dedicated to fostering innovation and research excellence.',
      date: new Date().toISOString().split('T')[0],
      category: 'Announcement',
      author: 'Admin',
      readTime: '2 min read',
    },
  });
  console.log('✅ Created news:', news1.title);

  // Create sample event
  const event1 = await prisma.event.create({
    data: {
      slug: 'innovation-workshop-2026',
      title: 'Innovation Workshop 2026',
      description: 'Join us for an exciting workshop on innovation and research methodologies.',
      date: '2026-04-15',
      time: '10:00 AM',
      location: 'SUST Campus, Auditorium',
      category: 'Workshop',
      image: '/uploads/workshop.jpg',
    },
  });
  console.log('✅ Created event:', event1.title);

  // Create sample project
  const project1 = await prisma.project.create({
    data: {
      title: 'AI for Healthcare',
      description: 'Developing AI-powered diagnostic tools for rural healthcare',
      category: 'Artificial Intelligence',
      status: 'Active',
      lead: 'Dr. Rahman',
      startDate: '2026-01-01',
      budget: 500000,
      team: JSON.stringify(['Dr. Rahman', 'Dr. Ahmed', '3 PhD Students']),
      technologies: JSON.stringify(['Python', 'TensorFlow', 'FastAPI']),
      publications: 3,
    },
  });
  console.log('✅ Created project:', project1.title);

  // Create sample team member
  const team1 = await prisma.team.create({
    data: {
      name: 'Dr. Muhammad Rahman',
      position: 'Lead Researcher',
      department: 'Computer Science',
      email: 'rahman@sust.edu',
      bio: 'Dr. Rahman specializes in artificial intelligence and machine learning with a focus on healthcare applications.',
      specializations: JSON.stringify(['AI', 'Machine Learning', 'Healthcare IT']),
      publications: 25,
      projects: JSON.stringify([1]),
    },
  });
  console.log('✅ Created team member:', team1.name);

  // Create about page
  const about = await prisma.about.create({
    data: {
      mission: 'To foster innovation and research excellence at SUST',
      vision: 'To become a leading research center in Bangladesh',
      description: 'The Research & Innovation Centre (RIC) at Shahjalal University of Science and Technology is dedicated to advancing knowledge through cutting-edge research.',
      established: '2020',
      achievements: JSON.stringify([
        'Over 100 research publications',
        '50+ active projects',
        '20+ industry partnerships',
        '200+ researchers',
      ]),
    },
  });
  console.log('✅ Created about page');

  // Create contact info
  const contact = await prisma.contact.create({
    data: {
      address: 'Shahjalal University of Science and Technology, Sylhet 3114, Bangladesh',
      phone: '+880-821-123456',
      email: 'info@ric-sust.edu.bd',
      officeHours: 'Saturday - Thursday: 9:00 AM - 5:00 PM',
    },
  });
  console.log('✅ Created contact info');

  // Create innovator
  const innovator = await prisma.innovator.create({
    data: {
      name: 'Dr. Fatima Akter',
      title: 'Innovation Lead',
      bio: 'Dr. Akter leads innovation initiatives at RIC-SUST with focus on sustainable technology.',
      specialization: 'Green Technology & Sustainability',
      achievements: 'Winner of National Innovation Award 2025',
    },
  });
  console.log('✅ Created innovator:', innovator.name);

  // Create home page data
  const home = await prisma.home.create({
    data: {
      hero: JSON.stringify({
        title: 'Research & Innovation Centre',
        subtitle: 'Shahjalal University of Science & Technology',
        description: 'Empowering innovation and research excellence for a better tomorrow',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }),
      stats: JSON.stringify([
        { label: 'Active Projects', value: '50+' },
        { label: 'Researchers', value: '200+' },
        { label: 'Publications', value: '100+' },
        { label: 'Partners', value: '20+' },
      ]),
    },
  });
  console.log('✅ Created home page data');

  // Create settings
  const settings = await prisma.settings.create({
    data: {
      general: JSON.stringify({
        siteName: 'RIC-SAU',
        tagline: 'Research & Innovation Centre - SUST',
        description: 'Leading research and innovation at Shahjalal University',
        footerText: '© 2026 Research & Innovation Centre, SUST. All rights reserved.',
      }),
      seo: JSON.stringify({
        metaTitle: 'RIC-SAU | Research & Innovation Centre',
        metaDescription: 'Fostering innovation and research excellence at SUST',
        metaKeywords: 'research, innovation, SUST, university, technology',
      }),
      social: JSON.stringify({
        facebook: 'https://facebook.com/ric-sust',
        twitter: 'https://twitter.com/ric_sust',
        linkedin: 'https://linkedin.com/company/ric-sust',
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
  console.log('✅ Created settings');

  console.log('\n🎉 Seeding completed successfully!\n');
  console.log('You can now:');
  console.log('  - Login with: admin@ric-sau.com / admin123');
  console.log('  - View data: npx prisma studio');
  console.log('  - Test API: curl http://localhost:3000/api/test-sqlite\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
