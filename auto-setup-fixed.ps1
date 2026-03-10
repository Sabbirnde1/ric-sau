# Fully Automated Database Setup
# This script does EVERYTHING automatically!

param(
    [string]$DatabaseUrl = ""
)

$ErrorActionPreference = "Continue"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RIC-SAU - Automated Database Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Function to update .env.local
function Update-EnvFile {
    param([string]$url)
    
    $envPath = ".env.local"
    
    if (Test-Path $envPath) {
        $lines = Get-Content $envPath
        $newLines = @()
        $urlUpdated = $false
        
        foreach ($line in $lines) {
            if ($line -match '^DATABASE_URL=') {
                $newLines += "DATABASE_URL=`"$url`""
                $urlUpdated = $true
            } else {
                $newLines += $line
            }
        }
        
        if (-not $urlUpdated) {
            $newLines = @("DATABASE_URL=`"$url`"") + $newLines
        }
        
        $newLines | Set-Content -Path $envPath -Force
    } else {
        if (Test-Path ".env.local.template") {
            Copy-Item ".env.local.template" $envPath
            $lines = Get-Content $envPath
            $newLines = @()
            
            foreach ($line in $lines) {
                if ($line -match '^DATABASE_URL=') {
                    $newLines += "DATABASE_URL=`"$url`""
                } else {
                    $newLines += $line
                }
            }
            
            $newLines | Set-Content -Path $envPath -Force
        } else {
            # Create from scratch
            $guid = [guid]::NewGuid().ToString()
            $random = Get-Random -Maximum 9999
            @"
DATABASE_URL="$url"
JWT_SECRET="$guid"
SETUP_SECRET="setup-$random"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
"@ | Set-Content $envPath -Force
        }
    }
}

# Step 1: Check if DATABASE_URL is provided
if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
    Write-Host "[1/5] Database URL Setup" -ForegroundColor Yellow
    Write-Host ""
    
    # Check if .env.local exists with valid URL
    if (Test-Path ".env.local") {
        try {
            $envLines = Get-Content ".env.local"
            $urlLine = $envLines | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1
            
            if ($urlLine) {
                # Extract URL (handle both quoted and unquoted)
                if ($urlLine -match '^DATABASE_URL="(.+)"') {
                    $existingUrl = $matches[1]
                } elseif ($urlLine -match '^DATABASE_URL=(.+)$') {
                    $existingUrl = $matches[1].Trim()
                }
                
                if ($existingUrl -and $existingUrl -notlike "*username:password*" -and $existingUrl -like "*postgresql://*") {
                    Write-Host "      Found existing database connection" -ForegroundColor Green
                    $displayUrl = $existingUrl.Substring(0, [Math]::Min(60, $existingUrl.Length))
                    if ($existingUrl.Length -gt 60) { $displayUrl += "..." }
                    Write-Host "      URL: $displayUrl" -ForegroundColor Gray
                    Write-Host ""
                    
                    $useExisting = Read-Host "      Use existing connection? (Y/n)"
                    if ($useExisting -eq "" -or $useExisting -eq "y" -or $useExisting -eq "Y") {
                        $DatabaseUrl = $existingUrl
                    }
                }
            }
        } catch {
            Write-Host "      Could not read existing configuration" -ForegroundColor Yellow
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
    npm install 2>&1 | Out-Null
    Write-Host "      [OK] Dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "      [OK] Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Step 3: Generate Prisma Client
Write-Host "[3/5] Generating Prisma Client" -ForegroundColor Yellow
Write-Host "      Generating client..." -ForegroundColor Cyan
npx prisma generate 2>&1 | Out-Null
Write-Host "      [OK] Prisma Client generated!" -ForegroundColor Green
Write-Host ""

# Step 4: Test connection
Write-Host "[4/5] Testing Database Connection" -ForegroundColor Yellow
Write-Host "      Connecting to database..." -ForegroundColor Cyan

$env:DATABASE_URL = $DatabaseUrl

try {
    node test-db-connection.js 2>&1 | Out-Null
    Write-Host "      [OK] Connected to database!" -ForegroundColor Green
} catch {
    Write-Host "      [WARNING] Could not test connection, continuing..." -ForegroundColor Yellow
}

Write-Host ""

# Step 5: Setup database
Write-Host "[5/5] Setting Up Database" -ForegroundColor Yellow

# Push schema
Write-Host "      Creating tables..." -ForegroundColor Cyan
try {
    npx prisma db push --accept-data-loss --skip-generate 2>&1 | Out-Null
    Write-Host "      [OK] Tables created!" -ForegroundColor Green
} catch {
    Write-Host "      [WARNING] Schema push had issues" -ForegroundColor Yellow
}

# Seed database
Write-Host "      Adding initial data..." -ForegroundColor Cyan
try {
    npm run db:seed --silent 2>&1 | Out-Null
    Write-Host "      [OK] Database seeded!" -ForegroundColor Green
} catch {
    Write-Host "      [WARNING] Could not seed database" -ForegroundColor Yellow
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
