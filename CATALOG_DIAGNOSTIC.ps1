# JOTYA Catalog - Quick Diagnostic Script
# Run this in PowerShell to diagnose catalog issues quickly

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  JOTYA CATALOG LUXE - DIAGNOSTIC CHECKER                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$checks_passed = 0
$checks_failed = 0

# Helper function for status output
function Write-Status($name, $pass, $details = "") {
    if ($pass) {
        Write-Host "✅ $name" -ForegroundColor Green
        $script:checks_passed++
    } else {
        Write-Host "❌ $name" -ForegroundColor Red
        if ($details) { Write-Host "   └─ $details" -ForegroundColor Yellow }
        $script:checks_failed++
    }
}

# ====== ENVIRONMENT CHECKS ======
Write-Host "`n📋 ENVIRONMENT CHECKS" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Node version
try {
    $nodeVersion = node --version
    $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    $nodePass = $nodeMajor -ge 18
    Write-Status "Node.js version: $nodeVersion" $nodePass "Minimum required: v18"
} catch {
    Write-Status "Node.js installed" $false "Not found in PATH"
}

# npm version
try {
    $npmVersion = npm --version
    $npmPass = $null -ne $npmVersion
    Write-Status "npm version: $npmVersion" $npmPass
} catch {
    Write-Status "npm installed" $false "Not found in PATH"
}

# Angular CLI
try {
    $ngVersion = ng version 2>&1 | Select-String "Angular CLI" | Select-Object -First 1
    $cliPass = $ngVersion -match "21\.\d+"
    Write-Status "Angular CLI 21.x" $cliPass "Found: $ngVersion"
} catch {
    Write-Status "Angular CLI installed" $false "Not found globally"
}

# ====== DIRECTORY STRUCTURE CHECKS ======
Write-Host "`n📁 DIRECTORY STRUCTURE CHECKS" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

$requiredDirs = @(
    "src/app/catalogue-luxe",
    "src/app/services",
    "src/app/shared/product-card",
    "src/assets/vetements",
    "src/assets/electro",
    "src/assets/maison",
    "src/assets/velo",
    "src/assets/construction",
    "node_modules/@angular"
)

foreach ($dir in $requiredDirs) {
    $fullPath = Join-Path $scriptPath $dir
    $exists = Test-Path -Path $fullPath -PathType Container
    Write-Status "Directory exists: $dir" $exists
}

# ====== CRITICAL FILES CHECKS ======
Write-Host "`n📄 CRITICAL FILES CHECKS" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

$requiredFiles = @(
    "src/app/catalogue-luxe/catalogue-luxe.component.ts",
    "src/app/catalogue-luxe/catalogue-luxe.component.html",
    "src/app/catalogue-luxe/catalogue-luxe.component.css",
    "src/app/services/product.service.ts",
    "src/app/shared/product-card/product-card.component.ts",
    "src/app/shared/product-card/product-card.component.html",
    "src/app/app.routes.ts",
    "angular.json",
    "package.json",
    "tsconfig.json"
)

foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $scriptPath $file
    $exists = Test-Path -Path $fullPath -PathType Leaf
    Write-Status "File exists: $file" $exists
}

# ====== IMAGE ASSET CHECKS ======
Write-Host "`n🖼️  IMAGE ASSET CHECKS" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

$categoryImages = @{
    "vetements" = 26
    "electro" = 11
    "maison" = 23
    "velo" = 7
    "construction" = 6
}

foreach ($category in $categoryImages.Keys) {
    $path = Join-Path $scriptPath "src/assets/$category"
    if (Test-Path -Path $path -PathType Container) {
        $count = (Get-ChildItem -Path $path -File | Measure-Object).Count
        $expected = $categoryImages[$category]
        $match = $count -ge $expected
        Write-Status "Category '$category': $count images (expected ~$expected)" $match
    } else {
        Write-Status "Category '$category' folder exists" $false
    }
}

# ====== BUILD CONFIGURATION CHECKS ======
Write-Host "`n⚙️  BUILD CONFIGURATION CHECKS" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check angular.json for assets
try {
    $angularJson = Get-Content -Path (Join-Path $scriptPath "angular.json") | ConvertFrom-Json
    $assets = $angularJson.projects.JOTYA.architect.build.options.assets
    $hasAssets = $null -ne $assets
    Write-Status "angular.json has 'assets' config" $hasAssets
    
    if ($hasAssets) {
        $assetsStr = $assets | ConvertTo-Json
        $hasSrcAssets = $assetsStr -match "src/assets"
        Write-Status "Assets includes 'src/assets'" $hasSrcAssets
    }
} catch {
    Write-Status "angular.json is valid JSON" $false "Parsing error"
}

# Check package.json scripts
try {
    $packageJson = Get-Content -Path (Join-Path $scriptPath "package.json") | ConvertFrom-Json
    $hasStart = $null -ne $packageJson.scripts.start
    $hasBuild = $null -ne $packageJson.scripts.build
    Write-Status "package.json has 'start' script" $hasStart
    Write-Status "package.json has 'build' script" $hasBuild
} catch {
    Write-Status "package.json is valid JSON" $false "Parsing error"
}

# ====== CODE CONTENT CHECKS ======
Write-Host "`n🔍 CODE CONTENT CHECKS" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

$componentPath = Join-Path $scriptPath "src/app/catalogue-luxe/catalogue-luxe.component.ts"
if (Test-Path -Path $componentPath) {
    $content = Get-Content -Path $componentPath -Raw
    
    Write-Status "Component has 'ngOnInit'" ($content -match "ngOnInit\(\)")
    Write-Status "Component has 'applyFilters'" ($content -match "applyFilters\(\)")
    Write-Status "Component imports ProductService" ($content -match "ProductService")
    Write-Status "Component imports ActivatedRoute" ($content -match "ActivatedRoute")
    Write-Status "Component subscribes to paramMap" ($content -match "paramMap")
}

$servicePath = Join-Path $scriptPath "src/app/services/product.service.ts"
if (Test-Path -Path $servicePath) {
    $content = Get-Content -Path $servicePath -Raw
    
    Write-Status "Service has 'getProducts'" ($content -match "getProducts\(\)")
    Write-Status "Service has 'getCategories'" ($content -match "getCategories\(\)")
    Write-Status "Service has 'generateAllProducts'" ($content -match "generateAllProducts\(\)")
    Write-Status "Service has 'imageConfigs'" ($content -match "imageConfigs")
}

$routesPath = Join-Path $scriptPath "src/app/app.routes.ts"
if (Test-Path -Path $routesPath) {
    $content = Get-Content -Path $routesPath -Raw
    
    Write-Status "Routes defined for catalogue-luxe" ($content -match "catalogue-luxe")
    Write-Status "Route parameter :category defined" ($content -match "catalogue-luxe/:category")
}

# ====== SUMMARY ======
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  DIAGNOSTIC SUMMARY                                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$total = $checks_passed + $checks_failed
$percentage = if ($total -gt 0) { [math]::Round(($checks_passed / $total) * 100) } else { 0 }

Write-Host "Checks Passed: " -NoNewline
Write-Host "$checks_passed/$total ($percentage%)" -ForegroundColor Green

if ($checks_failed -gt 0) {
    Write-Host "Checks Failed: " -NoNewline
    Write-Host "$checks_failed" -ForegroundColor Red
}

Write-Host "`n"

if ($checks_failed -eq 0) {
    Write-Host "✅ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host "`nYour project setup looks good. Run: npm start`n"
} else {
    Write-Host "⚠️  SOME CHECKS FAILED" -ForegroundColor Yellow
    Write-Host "`nRefer to CATALOG_ANALYSIS.md for detailed instructions on fixing issues.`n"
}

# ====== QUICK START COMMANDS ======
Write-Host "📚 QUICK START COMMANDS:" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "npm install              # Install dependencies" -ForegroundColor Cyan
Write-Host "npm start                # Start dev server (localhost:4200)" -ForegroundColor Cyan
Write-Host "npm test                 # Run unit tests" -ForegroundColor Cyan
Write-Host "npm run build            # Build for production" -ForegroundColor Cyan
Write-Host "`n"
