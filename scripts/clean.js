const fs = require('fs');
const path = require('path');

const dirsToClean = ['.next', '.turbo', 'out'];
const MAX_RETRIES = 3;
const RETRY_DELAY = 500; // ms

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function removeDir(dir, retries = 0) {
  const fullPath = path.join(process.cwd(), dir);
  
  if (!fs.existsSync(fullPath)) {
    return true;
  }

  try {
    // Use synchronous removal with recursive option and force flag
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✓ Cleaned: ${dir}`);
    return true;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(`⚠ Retry ${retries + 1}/${MAX_RETRIES} for ${dir}...`);
      await delay(RETRY_DELAY);
      return removeDir(dir, retries + 1);
    }
    // Don't fail the build if cleanup fails
    console.warn(`⚠ Warning: Could not clean ${dir}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🧹 Cleaning build cache...');
  
  for (const dir of dirsToClean) {
    await removeDir(dir);
  }
  
  console.log('✓ Cleanup complete\n');
}

main().catch(error => {
  console.error('Error during cleanup:', error);
  // Don't exit with error code - let build proceed
  process.exit(0);
});

