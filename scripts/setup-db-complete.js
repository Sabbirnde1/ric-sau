#!/usr/bin/env node

/**
 * Database Setup Helper Script
 * Runs all necessary steps to set up the database in the correct order
 * Usage: node scripts/setup-db-complete.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`\n▶ ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    log(`✓ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`✗ ${description} failed`, 'red');
    return false;
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════════╗', 'bright');
  log('║      Database Setup - Complete Initialization  ║', 'bright');
  log('╚════════════════════════════════════════════════╝\n', 'bright');

  // Check if .env exists
  if (!fs.existsSync('.env') && !fs.existsSync('.env.local')) {
    log('ERROR: .env or .env.local file not found!', 'red');
    log('Please create a .env.local file with DATABASE_URL', 'yellow');
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL || '';
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    log('ERROR: DATABASE_URL must be a PostgreSQL connection string.', 'red');
    log('Expected prefix: postgresql:// or postgres://', 'yellow');
    log('Current value is missing or uses a different protocol.', 'yellow');
    process.exit(1);
  }

  const steps = [
    {
      name: 'Create Database Tables',
      command: 'npx prisma db push --skip-generate --accept-data-loss',
      description: 'Creating database schema and tables',
    },
    {
      name: 'Seed Database',
      command: 'npx tsx prisma/seed.ts',
      description: 'Populating database with initial data',
    },
  ];

  let successCount = 0;
  for (const step of steps) {
    const success = runCommand(step.command, step.description);
    if (success) {
      successCount++;
    } else {
      log(`\n⚠ ${step.name} encountered an error`, 'yellow');
      log('Continuing with next step...', 'yellow');
    }
  }

  log('\n╔════════════════════════════════════════════════╗', 'bright');
  if (successCount === steps.length) {
    log('║         ✓ Database setup completed!           ║', 'bright');
    log('╚════════════════════════════════════════════════╝\n', 'bright');
    log('✓ Database initialized successfully!', 'green');
    log('\nNext steps:', 'green');
    log('1. Start dev server: npm run dev', 'green');
    log('2. Open browser: http://localhost:3000', 'green');
    log('3. Login at /login with:', 'green');
    log('   - Username: admin', 'green');
    log('   - Password: admin123', 'green');
    log('\n💡 Tip: Run "npm run db:studio" to browse the database', 'blue');
  } else {
    log(`║  ⚠ ${successCount}/${steps.length} steps completed              ║`, 'bright');
    log('╚════════════════════════════════════════════════╝\n', 'bright');
    log('Some steps had errors. Check the output above for details.', 'yellow');
    log('\nTroubleshooting:', 'yellow');
    log('- Ensure DATABASE_URL is a valid PostgreSQL URL', 'yellow');
    log('- Verify network access to your DB host', 'yellow');
    log('- Confirm DB user has create/insert privileges', 'yellow');
  }

  process.exit(successCount === steps.length ? 0 : 1);
}

main().catch(error => {
  log(`\nFatal error: ${error.message}`, 'red');
  process.exit(1);
});
