#!/usr/bin/env pwsh
<#
Smart Job Tracker Setup Script for Windows (PowerShell)
#>

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Smart Job Tracker Setup" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow

$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install from: https://nodejs.org/ (v14 or higher)" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green

# Check npm
$npmVersion = npm --version 2>$null
Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

Set-Location backend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

Set-Location ..\frontend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

Set-Location ..

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Green

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  - Backend: http://localhost:5000"
Write-Host "  - Frontend: http://localhost:3000"
Write-Host "  - Database: MongoDB Local (mongodb://localhost:27017)"
Write-Host "  - JWT Secret: Configured"

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "`n1. Make sure MongoDB is running:"
Write-Host "   mongod"
Write-Host "`n2. Open 2 terminal windows"
Write-Host "`n3. Terminal 1 - Start Backend:"
Write-Host "   cd backend"
Write-Host "   npm run dev"
Write-Host "`n4. Terminal 2 - Start Frontend:"
Write-Host "   cd frontend"
Write-Host "   npm run dev"
Write-Host "`n5. Visit in browser:"
Write-Host "   http://localhost:3000"
Write-Host "`nFor detailed instructions, see: QUICK_START.md`n"

Write-Host "============================================" -ForegroundColor Green
