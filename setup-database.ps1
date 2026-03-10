# Automated Database Setup Script
# This script helps you set up the database for RIC-SAU

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  RIC-SAU Database Setup Wizard" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "`n[1/5] Creating .env.local file..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "      Created .env.local from template" -ForegroundColor Green
    } else {
        Write-Host "      ERROR: .env.example not found!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`n[1/5] .env.local already exists" -ForegroundColor Green
}

# Check DATABASE_URL
Write-Host "`n[2/5] Checking DATABASE_URL..." -ForegroundColor Yellow
$envContent = Get-Content ".env.local" -Raw
$databaseUrl = $envContent | Select-String -Pattern 'DATABASE_URL="([^"]+)"' | ForEach-Object { $_.Matches.Groups[1].Value }

if (-not $databaseUrl) {
    $databaseUrl = $envContent | Select-String -Pattern 'DATABASE_URL=([^\r\n]+)' | ForEach-Object { $_.Matches.Groups[1].Value }
}

$needsSetup = $false

if ($databaseUrl -like "*username:password*" -or $databaseUrl -eq "postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech:5432/neondb?sslmode=require") {
    Write-Host "      DATABASE_URL is still a placeholder" -ForegroundColor Red
    $needsSetup = $true
} elseif ($databaseUrl -like "*neon.tech*") {
    Write-Host "      Found Neon database connection" -ForegroundColor Green
    
    if ($databaseUrl -notlike "*sslmode=require*") {
        Write-Host "      WARNING: Missing ?sslmode=require" -ForegroundColor Red
        $needsSetup = $true
    }
} elseif ($databaseUrl -like "file:*") {
    Write-Host "      Using SQLite (local only)" -ForegroundColor Yellow
    Write-Host "      WARNING: Won't work on Netlify!" -ForegroundColor Red
} else {
    Write-Host "      DATABASE_URL is configured" -ForegroundColor Green
}

if ($needsSetup) {
    Write-Host "`n=====================================" -ForegroundColor Red
    Write-Host "  DATABASE_URL Needs Configuration!" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Quick Setup (5 minutes):" -ForegroundColor Yellow
    Write-Host "1. Go to: https://neon.tech" -ForegroundColor White
    Write-Host "2. Sign up (free, no credit card)" -ForegroundColor White
    Write-Host "3. Create project: 'ric-sau'" -ForegroundColor White
    Write-Host "4. Copy 'Pooled' connection string" -ForegroundColor White
    Write-Host "5. Edit .env.local and replace DATABASE_URL" -ForegroundColor White
    Write-Host "6. Run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "See NEON_DATABASE_SETUP.md for detailed instructions" -ForegroundColor Cyan
    Write-Host ""
    
    # Ask if user wants to open Neon in browser
    $response = Read-Host "Open Neon website now? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        Start-Process "https://neon.tech"
    }
    
    exit 0
}

# Check Prisma
Write-Host "`n[3/5] Checking Prisma Client..." -ForegroundColor Yellow
if (Test-Path "node_modules/@prisma/client") {
    Write-Host "      Prisma Client is installed" -ForegroundColor Green
} else {
    Write-Host "      Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Generate Prisma Client
Write-Host "`n[4/5] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Prisma Client generated successfully" -ForegroundColor Green
} else {
    Write-Host "      ERROR: Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

# Test connection
Write-Host "`n[5/5] Testing database connection..." -ForegroundColor Yellow
node test-db-connection.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=====================================" -ForegroundColor Green
    Write-Host "  Database Setup Complete!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Push schema to database:" -ForegroundColor White
    Write-Host "   npm run db:push" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Seed initial data:" -ForegroundColor White
    Write-Host "   npm run db:seed" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Start development server:" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "4. Login at http://localhost:3000/login" -ForegroundColor White
    Write-Host "   Username: admin" -ForegroundColor Cyan
    Write-Host "   Password: admin123" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "`n=====================================" -ForegroundColor Red
    Write-Host "  Connection Test Failed" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Verify DATABASE_URL in .env.local" -ForegroundColor White
    Write-Host "2. Check NEON_DATABASE_SETUP.md" -ForegroundColor White
    Write-Host "3. Run: npm run check:neon" -ForegroundColor White
    Write-Host ""
}
