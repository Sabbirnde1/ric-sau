// Database Connection Test Script
// Run with: node test-db-connection.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  console.log('\n====================================');
  console.log('  Database Connection Test');
  console.log('====================================\n');

  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('❌ ERROR: DATABASE_URL is not set');
      console.log('\n💡 Solution:');
      console.log('   1. Copy .env.example to .env.local');
      console.log('   2. Add your Neon connection string');
      console.log('   3. See NEON_DATABASE_SETUP.md for help\n');
      process.exit(1);
    }

    console.log('📋 Configuration:');
    const dbUrl = process.env.DATABASE_URL;
    
    // Mask password for security
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
    console.log(`   DATABASE_URL: ${maskedUrl}`);
    
    // Detect database type
    if (dbUrl.includes('neon.tech')) {
      console.log('   Provider: Neon PostgreSQL ✓');
    } else if (dbUrl.includes('supabase')) {
      console.log('   Provider: Supabase PostgreSQL ✓');
    } else if (dbUrl.includes('railway')) {
      console.log('   Provider: Railway PostgreSQL ✓');
    } else if (dbUrl.startsWith('postgresql://')) {
      console.log('   Provider: PostgreSQL ✓');
    } else if (dbUrl.startsWith('file:')) {
      console.log('   Provider: SQLite (local only) ⚠️');
      console.log('   ⚠️  WARNING: SQLite will NOT work on Netlify!');
    } else {
      console.log('   Provider: Unknown');
    }
    
    // Check for SSL mode
    if (dbUrl.includes('sslmode=require')) {
      console.log('   SSL Mode: Required ✓');
    } else if (dbUrl.startsWith('postgresql://')) {
      console.log('   SSL Mode: Missing ⚠️');
      console.log('   💡 Add ?sslmode=require to your connection string');
    }
    
    console.log('\n🔌 Testing connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!\n');
    
    // Test query execution
    console.log('🧪 Testing query execution...');
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('✅ Query executed successfully!');
    console.log(`   Server time: ${result[0].current_time || result[0].NOW || 'N/A'}\n`);
    
    // Check if tables exist
    console.log('📊 Checking database tables...');
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `;
      
      if (tables.length === 0) {
        console.log('⚠️  No tables found in database');
        console.log('\n💡 Next steps:');
        console.log('   1. Run: npm run db:push');
        console.log('   2. Run: npm run db:seed');
        console.log('   3. Run test again\n');
      } else {
        console.log(`✅ Found ${tables.length} tables:`);
        tables.forEach(t => console.log(`   - ${t.table_name}`));
        
        // Check for User table specifically
        const hasUserTable = tables.some(t => t.table_name === 'User');
        if (hasUserTable) {
          const userCount = await prisma.user.count();
          console.log(`\n👤 Users in database: ${userCount}`);
          
          if (userCount === 0) {
            console.log('⚠️  No users found - database needs seeding');
            console.log('💡 Run: npm run db:seed\n');
          } else {
            console.log('✅ Database is ready!\n');
          }
        }
      }
    } catch (tableError) {
      console.log('⚠️  Could not check tables (database might be empty)');
      console.log('💡 Run: npm run db:push\n');
    }
    
    console.log('====================================');
    console.log('✅ All tests passed!');
    console.log('====================================\n');
    
  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error details:', error.message);
    
    // Provide specific help based on error
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Solution: Check your database hostname');
      console.log('   - Verify connection string is correct');
      console.log('   - Check your internet connection\n');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Solution: Check your credentials');
      console.log('   - Username and password might be wrong');
      console.log('   - Copy connection string again from Neon\n');
    } else if (error.message.includes('SSL')) {
      console.log('\n💡 Solution: Add SSL mode to connection string');
      console.log('   - Add ?sslmode=require to the end\n');
    } else if (error.message.includes('does not exist')) {
      console.log('\n💡 Solution: Database or table missing');
      console.log('   - Run: npm run db:push\n');
    } else {
      console.log('\n💡 General solutions:');
      console.log('   1. Verify DATABASE_URL in .env.local');
      console.log('   2. Check NEON_DATABASE_SETUP.md');
      console.log('   3. Run: npm run check:neon\n');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection();
