# RIC-SAU Netlify Deployment ZIP Creator
# This script creates a deployment-ready ZIP file excluding unnecessary files
# Author: GitHub Copilot
# Date: March 10, 2026

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  RIC-SAU Deployment ZIP Creator" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Get current directory
$projectRoot = Get-Location
Write-Host "`n📁 Project directory: $projectRoot" -ForegroundColor Yellow

# Define output path
$timestamp = Get-Date -Format "yyyy-MM-dd-HHmm"
$zipName = "ric-sau-deploy-$timestamp.zip"
$zipPath = Join-Path (Split-Path $projectRoot -Parent) $zipName

# Files and folders to exclude
$excludePatterns = @(
    "*\node_modules\*",
    "*\.next\*",
    "*\.netlify\*",
    "*\.vercel\*",
    "*\.git\*",
    "*\.vscode\*",
    "*\.idea\*",
    "*\out\*",
    "*\build\*",
    "*.env",
    "*.env.local",
    "*.env.*.local",
    "*.db",
    "*.sqlite*",
    "*.log",
    "*\logs\*",
    "*\tmp\*",
    "*\temp\*",
    "*\.DS_Store",
    "*\Thumbs.db",
    "*\public\uploads\*"
)

Write-Host "`n🔍 Scanning project files..." -ForegroundColor Yellow

# Get all files recursively
$allFiles = Get-ChildItem -Path $projectRoot -Recurse -File -ErrorAction SilentlyContinue

# Filter out excluded files
$filesToInclude = $allFiles | Where-Object {
    $filePath = $_.FullName
    $include = $true
    
    foreach ($pattern in $excludePatterns) {
        if ($filePath -like $pattern) {
            $include = $false
            break
        }
    }
    
    $include
}

$fileCount = $filesToInclude.Count
$totalSize = ($filesToInclude | Measure-Object -Property Length -Sum).Sum
$sizeMB = [math]::Round($totalSize / 1MB, 2)

Write-Host "`n✅ Found $fileCount files to include" -ForegroundColor Green
Write-Host "📦 Total size: $sizeMB MB" -ForegroundColor Green

if ($sizeMB -gt 50) {
    Write-Host "`n⚠️  WARNING: ZIP size is larger than expected!" -ForegroundColor Red
    Write-Host "   This might include node_modules or build folders." -ForegroundColor Red
    Write-Host "   Expected size: 5-15 MB" -ForegroundColor Yellow
    
    $continue = Read-Host "`nContinue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "`n❌ Cancelled." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n📦 Creating ZIP file..." -ForegroundColor Yellow

# Delete existing ZIP if it exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

try {
    # Create temporary folder structure
    $tempFolder = Join-Path $env:TEMP "ric-sau-deploy-temp"
    if (Test-Path $tempFolder) {
        Remove-Item $tempFolder -Recurse -Force
    }
    New-Item -ItemType Directory -Path $tempFolder -Force | Out-Null
    
    # Copy files maintaining structure
    foreach ($file in $filesToInclude) {
        $relativePath = $file.FullName.Substring($projectRoot.Path.Length + 1)
        $destPath = Join-Path $tempFolder $relativePath
        $destDir = Split-Path $destPath -Parent
        
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        Copy-Item $file.FullName -Destination $destPath -Force
    }
    
    # Create ZIP from temp folder
    Compress-Archive -Path "$tempFolder\*" -DestinationPath $zipPath -Force
    
    # Clean up temp folder
    Remove-Item $tempFolder -Recurse -Force
    
    $finalSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
    
    Write-Host "`n✅ SUCCESS! Deployment ZIP created!" -ForegroundColor Green
    Write-Host "`n📦 ZIP Details:" -ForegroundColor Cyan
    Write-Host "   Location: $zipPath" -ForegroundColor White
    Write-Host "   Size: $finalSize MB" -ForegroundColor White
    Write-Host "   Files: $fileCount" -ForegroundColor White
    
    Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Go to https://app.netlify.com" -ForegroundColor White
    Write-Host "   2. Drag and drop the ZIP file" -ForegroundColor White
    Write-Host "   3. Configure environment variables" -ForegroundColor White
    Write-Host "   4. Deploy!" -ForegroundColor White
    
    Write-Host "`n📖 For detailed instructions, see:" -ForegroundColor Yellow
    Write-Host "   NETLIFY_DEPLOYMENT.md" -ForegroundColor White
    
    # Ask if user wants to open the folder
    $openFolder = Read-Host "`n📂 Open folder containing ZIP file? (Y/n)"
    if ($openFolder -ne "n" -and $openFolder -ne "N") {
        explorer.exe (Split-Path $zipPath -Parent)
    }
    
} catch {
    Write-Host "`n❌ ERROR: Failed to create ZIP file" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  Done! Happy deploying! 🎉" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
