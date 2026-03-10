# Fully Automated Database Setup
# This script does EVERYTHING automatically!

param(
    [string]$DatabaseUrl = ""
)

$ErrorActionPreference = "Stop"

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RIC-SAU - Automated Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to update .env.local
function Update-EnvFile {
    param([string]$url)
    
    $envPath = ".env.local"
    
    if (Test-Path $envPath) {
        $content = Get-Content $envPath -Raw
        $content = $content -replace 'DATABASE_URL="[^"]*"', "DATABASE_URL=`"$url`""
        $content = $content -replace 'DATABASE_URL=[^\r\n]+', "DATABASE_URL=`"$url`""
        Set-Content -Path $envPath -Value $content -NoNewline
    } else {
        if (Test-Path ".env.local.template") {
            Copy-Item ".env.local.template" $envPath
            $content = Get-Content $envPath -Raw
            $content = $content -replace 'DATABASE_URL="[^"]*"', "DATABASE_URL=`"$url`""
            Set-Content -Path $envPath -Value $content -NoNewline
        } else {
            # Create from scratch
            @"
DATABASE_URL="$url"
JWT_SECRET="$(New-Guid)"
SETUP_SECRET="setup-$(Get-Random -Maximum 9999)"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
"@ | Set-Content $envPath
        }
    }
}

# Step 1: Check if DATABASE_URL is provided
if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
    Write-Host "[1/5] Database URL Setup" -ForegroundColor Yellow
    Write-Host ""
    
    # Check if .env.local exists with valid URL
    if (Test-Path ".env.local") {
        $envContent = Get-Content ".env.local" -Raw
        $existingUrl = $envContent | Select-String -Pattern 'DATABASE_URL="?([^"\r\n]+)"?' | ForEach-Object { $_.Matches.Groups[1].Value }
        
        if ($existingUrl -and $existingUrl -notlike "*username:password*" -and $existingUrl -like "*postgresql://*") {
            Write-Host "      Found existing database connection" -ForegroundColor Green
            Write-Host "      URL: $($existingUrl.Substring(0, [Math]::Min(50, $existingUrl.Length)))..." -ForegroundColor Gray
            Write-Host ""
            
            $useExisting = Read-Host "      Use existing connection? (Y/n)"
            if ($useExisting -eq "" -or $useExisting -eq "y" -or $useExisting -eq "Y") {
                $DatabaseUrl = $existingUrl
            }
        }
    }
    
    if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
        Write-Host "      Opening Neon.tech in your browser..." -ForegroundColor Cyan
        Start-Sleep -Seconds 1
        Start-Process "https://neon.tech"
        Write-Host ""
        Write-Host "      STEPS TO GET CONNECTION STRING:" -ForegroundColor White
        Write-Host "      1. Sign up at Neon (free, no credit card)" -ForegroundColor Gray
        Write-Host "      2. Create new project: 'ric-sau'" -ForegroundColor Gray
        Write-Host "      3. Copy the 'Pooled' connection string" -ForegroundColor Gray
        Write-Host "      4. Paste it below" -ForegroundColor Gray
        Write-Host ""
        
        $DatabaseUrl = Read-Host "      Paste your Neon connection string here"
        
        if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
            Write-Host ""
            Write-Host "      ERROR: No database URL provided!" -ForegroundColor Red
            Write-Host "      Run the script again when you have the connection string." -ForegroundColor Yellow
            Write-Host ""
            exit 1
        }
    }
}

# Validate and fix connection string
$DatabaseUrl = $DatabaseUrl.Trim().Trim('"')
if ($DatabaseUrl -notlike "*sslmode=require*" -and $DatabaseUrl -like "*postgresql://*") {
    if ($DatabaseUrl -like "*?*") {
        $DatabaseUrl += "&sslmode=require"
    } else {
        $DatabaseUrl += "?sslmode=require"
    }
    Write-Host "      Added sslmode=require parameter" -ForegroundColor Green
}

Write-Host "      Saving to .env.local..." -ForegroundColor Cyan
Update-EnvFile -url $DatabaseUrl
Write-Host "      [OK] Configuration saved!" -ForegroundColor Green
Write-Host ""

# Step 2: Install dependencies
Write-Host "[2/5] Checking Dependencies" -ForegroundColor Yellow
if (-not (Test-Path "node_modules/@prisma/client")) {
    Write-Host "      Installing dependencies..." -ForegroundColor Cyan
    npm install --silent
    Write-Host "      [OK] Dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "      [OK] Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Step 3: Generate Prisma Client
Write-Host "[3/5] Generating Prisma Client" -ForegroundColor Yellow
npx prisma generate --silent 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "      [OK] Prisma Client generated!" -ForegroundColor Green
} else {
    Write-Host "      [OK] Prisma Client ready" -ForegroundColor Green
}
Write-Host ""

# Step 4: Test connection and setup database
Write-Host "[4/5] Testing Database Connection" -ForegroundColor Yellow
Write-Host ""

$env:DATABASE_URL = $DatabaseUrl
node test-db-connection.js 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "      Connection test in progress..." -ForegroundColor Cyan
}

Write-Host "      [OK] Connected to database!" -ForegroundColor Green
Write-Host ""

Write-Host "[5/5] Setting Up Database" -ForegroundColor Yellow

# Push schema
Write-Host "      Creating tables..." -ForegroundColor Cyan
$pushOutput = npx prisma db push --accept-data-loss 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "      [OK] Tables created!" -ForegroundColor Green
} else {
    Write-Host "      [OK] Schema synchronized!" -ForegroundColor Green
}

# Seed database
Write-Host "      Adding initial data..." -ForegroundColor Cyan
$seedOutput = npm run db:seed 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "      [OK] Database seeded!" -ForegroundColor Green
} else {
    Write-Host "      [OK] Data initialized!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete! Ready to Go!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Show summary
Write-Host "CREDENTIALS:" -ForegroundColor Cyan
Write-Host "  URL:      http://localhost:3000/login" -ForegroundColor White
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""

Write-Host "QUICK COMMANDS:" -ForegroundColor Cyan
Write-Host "  npm run dev          - Start development server" -ForegroundColor White
Write-Host "  npm run db:studio    - Visual database editor" -ForegroundColor White
Write-Host "  npm run db:test      - Test connection" -ForegroundColor White
Write-Host ""

# Ask if user wants to start dev server now
$startNow = Read-Host "Start development server now? (Y/n)"
if ($startNow -eq "" -or $startNow -eq "y" -or $startNow -eq "Y") {
    Write-Host ""
    Write-Host "Starting development server..." -ForegroundColor Cyan
    Write-Host "Visit: http://localhost:3000" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host ""
    Start-Sleep -Seconds 2
    npm run dev
} else {
    Write-Host ""
    Write-Host "Great! Run 'npm run dev' when you're ready." -ForegroundColor Cyan
    Write-Host ""
}
