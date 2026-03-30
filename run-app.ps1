#!/usr/bin/env pwsh
<#
Start Smart Job Tracker - All Services
#>

Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     STARTING SMART JOB TRACKER + RESUME ANALYZER           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n[1/3] Checking Backend Dependencies..." -ForegroundColor Yellow

# Check backend node_modules
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "    Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location backend
    npm install --legacy-peer-deps
    Pop-Location
}
Write-Host "    ✓ Backend ready" -ForegroundColor Green

Write-Host "`n[2/3] Checking Frontend Dependencies..." -ForegroundColor Yellow

# Check frontend node_modules
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "    Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
}
Write-Host "    ✓ Frontend ready" -ForegroundColor Green

Write-Host "`n[3/3] Launching Services..." -ForegroundColor Yellow

# Check if MongoDB is running on Windows
$mongoRunning = $false
try {
    $testMongo = & { mongod --version 2>$null }
    if ($?) {
        Write-Host "    ✓ MongoDB found on system" -ForegroundColor Green
        $mongoRunning = $true
    }
} catch {
    Write-Host "    ! MongoDB not detected. Make sure mongod is running!" -ForegroundColor Yellow
}

# Start Backend Server
Write-Host "`n    Starting Backend Server on :5000..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", {
    Set-Location 'd:\web dev\job_search\backend'
    Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  BACKEND SERVER (Port 5000)                ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host "`nStarting development server..." -ForegroundColor Yellow
    npm run dev
    Write-Host "`n[Press Ctrl+C to stop server]" -ForegroundColor Gray
    Read-Host
}

Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "    Starting Frontend App on :3000..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", {
    Set-Location 'd:\web dev\job_search\frontend'
    Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  FRONTEND APP (Port 3000)                  ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host "`nStarting development app..." -ForegroundColor Yellow
    npm run dev
    Write-Host "`n[Press Ctrl+C to stop app]" -ForegroundColor Gray
    Read-Host
}

Start-Sleep -Seconds 3

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                  ✅ SERVERS STARTING...                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n📋 Configuration:" -ForegroundColor Yellow
Write-Host "   Backend API:     http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Frontend App:    http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Database:        MongoDB (localhost:27017)" -ForegroundColor Cyan

Write-Host "`n⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open browser
Write-Host "`n🌐 Opening application in browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Register a new account with email & password" -ForegroundColor White
Write-Host "   2. Login with your credentials" -ForegroundColor White
Write-Host "   3. Add job applications" -ForegroundColor White
Write-Host "   4. View analytics dashboard" -ForegroundColor White
Write-Host "   5. Try the resume analyzer" -ForegroundColor White

Write-Host "`n💡 Tips:" -ForegroundColor Yellow
Write-Host "   • Check backend terminal for server logs" -ForegroundColor Gray
Write-Host "   • Check frontend terminal for build/dev logs" -ForegroundColor Gray
Write-Host "   • Open DevTools (F12) to see any errors" -ForegroundColor Gray
Write-Host "   • Press Ctrl+C in any terminal to stop that service" -ForegroundColor Gray

Write-Host "`n📚 Documentation:" -ForegroundColor Yellow
Write-Host "   Main README:     d:\web dev\job_search\README.md" -ForegroundColor Gray
Write-Host "   Setup Guide:     d:\web dev\job_search\SETUP_GUIDE.md" -ForegroundColor Gray
Write-Host "   Architecture:    d:\web dev\job_search\explanation.txt" -ForegroundColor Gray
Write-Host "   Quick Start:     d:\web dev\job_search\QUICK_START.md" -ForegroundColor Gray

Write-Host "`n════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Application is starting! Check the new terminal windows..." -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
