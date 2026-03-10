# Neon Database Configuration Helper
# This script helps verify your Neon database connection string

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  Neon Database Configuration Check" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "`n[OK] Found .env.local file" -ForegroundColor Green
    
    # Read DATABASE_URL
    $envContent = Get-Content ".env.local" -Raw
    $databaseUrl = $envContent | Select-String -Pattern 'DATABASE_URL=(.+)' | ForEach-Object { $_.Matches.Groups[1].Value }
    
    if ($databaseUrl) {
        Write-Host "`n[INFO] Checking your connection string..." -ForegroundColor Yellow
        
        # Check if it's a Neon URL
        if ($databaseUrl -like "*neon.tech*") {
            Write-Host "[OK] Detected Neon database" -ForegroundColor Green
            
            # Check for SSL mode
            if ($databaseUrl -like "*sslmode=require*") {
                Write-Host "[OK] SSL mode configured correctly" -ForegroundColor Green
            } else {
                Write-Host "[WARNING] Missing ?sslmode=require parameter" -ForegroundColor Red
                Write-Host "   Add ?sslmode=require to the end of your connection string" -ForegroundColor Yellow
            }
            
            # Check if it's pooled connection
            if ($databaseUrl -like "*pooler.neon.tech*" -or $databaseUrl -like "*-pooler.*") {
                Write-Host "[OK] Using pooled connection (recommended)" -ForegroundColor Green
            } else {
                Write-Host "[INFO] Consider using pooled connection for better performance" -ForegroundColor Yellow
            }
            
            Write-Host "`n[SUMMARY] Your Neon configuration looks good!" -ForegroundColor Green
            
        } elseif ($databaseUrl -like "*localhost*") {
            Write-Host "[INFO] Using local PostgreSQL" -ForegroundColor Yellow
            
        } elseif ($databaseUrl -like "file:*") {
            Write-Host "[INFO] Using SQLite (local development only)" -ForegroundColor Yellow
            Write-Host "[WARNING] SQLite will NOT work on Netlify!" -ForegroundColor Red
            
        } elseif ($databaseUrl -like "*supabase*") {
            Write-Host "[INFO] Using Supabase database" -ForegroundColor Yellow
            
        } elseif ($databaseUrl -like "*railway*") {
            Write-Host "[INFO] Using Railway database" -ForegroundColor Yellow
            
        } else {
            Write-Host "[INFO] Using custom PostgreSQL database" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "`n[ERROR] DATABASE_URL not found in .env.local" -ForegroundColor Red
        Write-Host "   Add: DATABASE_URL=your-connection-string" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "`n[INFO] No .env.local file found" -ForegroundColor Yellow
    Write-Host "`nCreating .env.local template..." -ForegroundColor Yellow
    
    $template = @"
# Neon Database Connection
# Get your connection string from: https://neon.tech
# Format: postgresql://username:password@ep-xxx.region.aws.neon.tech:5432/neondb?sslmode=require
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech:5432/neondb?sslmode=require"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-secure-jwt-secret-key"

# Setup Secret (for initial database setup)
SETUP_SECRET="your-setup-secret-123"

# Site URLs (for local development)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
"@
    
    Set-Content -Path ".env.local" -Value $template
    Write-Host "[OK] Created .env.local template" -ForegroundColor Green
    Write-Host "   Edit the file and add your Neon connection string" -ForegroundColor Yellow
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  Next Steps" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Get Neon database:" -ForegroundColor White
Write-Host "   https://neon.tech (free, no credit card)" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Add connection string to .env.local" -ForegroundColor White
Write-Host ""
Write-Host "3. For Netlify deployment:" -ForegroundColor White
Write-Host "   - Add DATABASE_URL to Netlify environment variables" -ForegroundColor Cyan
Write-Host "   - See NEON_DATABASE_SETUP.md for full guide" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Test connection:" -ForegroundColor White
Write-Host "   npx prisma db push" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Seed database:" -ForegroundColor White
Write-Host "   npm run db:seed" -ForegroundColor Cyan
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
