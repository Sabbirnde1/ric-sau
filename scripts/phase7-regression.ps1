param(
  [string]$BaseUrl = ""
)

$ErrorActionPreference = "Stop"

function Run-Step {
  param(
    [string]$Name,
    [string]$Command
  )

  Write-Host ""
  Write-Host "=============================="
  Write-Host "Phase 7: $Name"
  Write-Host "=============================="
  Write-Host "Command: $Command"

  Invoke-Expression $Command
  if ($LASTEXITCODE -ne 0) {
    throw "Step failed: $Name (exit code: $LASTEXITCODE)"
  }

  Write-Host "PASS: $Name"
}

function Get-ApiJson {
  param([string]$Url)

  try {
    return Invoke-RestMethod -Uri $Url -Method Get -TimeoutSec 30
  }
  catch {
    throw "Request failed for $Url. $($_.Exception.Message)"
  }
}

Run-Step -Name "Lint" -Command "npm run lint"
Run-Step -Name "Database Connectivity" -Command "npm run db:test"
Run-Step -Name "Production Build" -Command "npm run build"

if ([string]::IsNullOrWhiteSpace($BaseUrl)) {
  if (-not [string]::IsNullOrWhiteSpace($env:NEXT_PUBLIC_SITE_URL)) {
    $BaseUrl = $env:NEXT_PUBLIC_SITE_URL
  }
}

if (-not [string]::IsNullOrWhiteSpace($BaseUrl)) {
  $BaseUrl = $BaseUrl.TrimEnd('/')

  Write-Host ""
  Write-Host "=============================="
  Write-Host "Phase 7: Live Smoke Checks"
  Write-Host "=============================="
  Write-Host "Target URL: $BaseUrl"

  $diag = Get-ApiJson -Url "$BaseUrl/api/diagnose"
  if (-not $diag.success) {
    throw "Smoke check failed: /api/diagnose returned success=false"
  }

  $content = Get-ApiJson -Url "$BaseUrl/api/content?type=projects&limit=5&offset=0"
  if (-not $content.success) {
    throw "Smoke check failed: /api/content returned success=false"
  }

  $count = 0
  if ($null -ne $content.data) {
    $count = @($content.data).Count
  }

  Write-Host "PASS: /api/diagnose"
  Write-Host "PASS: /api/content (projects count: $count)"

  if ($null -eq $content.pagination) {
    Write-Warning "Pagination metadata missing from /api/content response. Validate deployed API version before full rollout."
  }
}
else {
  Write-Warning "BaseUrl not provided and NEXT_PUBLIC_SITE_URL is empty. Skipping live smoke checks."
}

Write-Host ""
Write-Host "=========================================="
Write-Host "Phase 7 validation completed successfully."
Write-Host "=========================================="