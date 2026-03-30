@echo off
REM Smart Job Tracker Setup Script for Windows

echo.
echo ============================================
echo Smart Job Tracker Setup
echo ============================================
echo.

REM Check if Node.js is installed
echo Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/ (v14 or higher)
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo ✓ npm found:
npm --version

echo.
echo ============================================
echo Installing Backend Dependencies
echo ============================================
echo.

cd backend
call npm install

if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✓ Backend dependencies installed

echo.
echo ============================================
echo Installing Frontend Dependencies
echo ============================================
echo.

cd ..\frontend
call npm install

if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✓ Frontend dependencies installed

cd ..

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Configuration:
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo - Database: MongoDB Local (mongodb://localhost:27017)
echo - JWT Secret: Configured
echo.
echo Next Steps:
echo 1. Make sure MongoDB is running (mongod)
echo 2. Open 2 terminal windows
echo 3. In Terminal 1: cd backend && npm run dev
echo 4. In Terminal 2: cd frontend && npm run dev
echo 5. Visit http://localhost:3000 in your browser
echo.
echo For detailed instructions, see: QUICK_START.md
echo.
pause
