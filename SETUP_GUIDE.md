# 🚀 Complete Setup & Run Guide

## Prerequisites Check

Before we begin, make sure you have:

- ✅ **Node.js v14+** - [Download here](https://nodejs.org/)
- ✅ **MongoDB** - Either:
  - Local installation via [mongodb.com](https://www.mongodb.com/try/download/community)
  - OR MongoDB Atlas (cloud) - [Free tier at atlas.mongodb.com](https://www.mongodb.com/cloud/atlas)
- ✅ **Git** (optional) - For version control

## Automatic Setup

### Option 1: PowerShell (Recommended for Windows)
```powershell
.\setup.ps1
```

### Option 2: Command Prompt (CMD)
```cmd
setup.bat
```

These scripts will:
1. Check if Node.js is installed
2. Install all backend dependencies
3. Install all frontend dependencies
4. Configure environment variables
5. Verify everything works

**If you get a PowerShell execution policy error, run this first:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Manual Setup (If Automatic Doesn't Work)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure MongoDB

Check `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/job_tracker
```

**If using local MongoDB:**
```bash
# Windows - In separate terminal
mongod
```

**If using MongoDB Atlas:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job_tracker?retryWrites=true&w=majority
```

### Step 3: Verify Configuration

Check `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job_tracker
JWT_SECRET=smart_job_tracker_secret_2026_dev_key_12345
JWT_EXPIRY=7d
NODE_ENV=development
```

✅ If all values are set correctly, you're ready!

---

## Running the Application

### Option A: Run Both Automatically (PowerShell)

Create `run.ps1`:
```powershell
# Start Backend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait 3 seconds
Start-Sleep -Seconds 3

# Start Frontend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Opening app in browser..."

Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"
```

Run it:
```powershell
.\run.ps1
```

### Option B: Run Manually (Recommended)

**Terminal 1 - MongoDB (if using local):**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.0.0 ready in XXX ms
➜ Local: http://localhost:3000
```

**Open Browser:**
```
http://localhost:3000
```

---

## ✅ Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"success":true,"message":"Server is running"}
```

### Frontend Load
Open http://localhost:3000

You should see:
- Login page
- Email & password input fields
- "Don't have an account? Register" link

---

## 📝 First Steps

1. **Register**
   - Click "Register" 
   - Create account with email & password
   - Click "Register" button

2. **Login**
   - Use your credentials
   - You'll see the Dashboard

3. **Add Job Application**
   - Click "Add Job Application"
   - Fill in company name & position
   - Click "Add Job Application"

4. **View Stats**
   - See analytics cards update
   - Try different statuses (Applied, Interview, etc.)

5. **Analyze Resume**
   - Click "Resume Analyzer" in navbar
   - Paste resume text
   - Paste job description
   - Click "Analyze Resume"
   - Get ATS score & suggestions

---

## 🧪 Run Tests

### Backend Tests
```bash
cd backend
npm test

# or watch mode
npm run test:watch
```

Expected output:
```
PASS  tests/unit/authService.test.js
  AuthService
    register
      ✓ should register a new user successfully
    login
      ✓ should login user successfully
    ...

PASS  tests/unit/authController.test.js
...

Test Suites: 5 passed, 5 total
```

---

## 🐛 Troubleshooting

### "Node.js not found"
```bash
# Check if installed
node --version

# If not installed, download from https://nodejs.org/
```

### "Port 5000 already in use"
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change PORT in backend/.env to 5001
```

### "MongoDB connection error"
```bash
# Check if MongoDB is running
# If local: mongod should be running in a terminal
# If Atlas: Check connection string in .env

# Test connection
mongosh "mongodb://localhost:27017"
```

### "CORS error when accessing backend"
- Make sure backend is running on :5000
- Make sure frontend is on :3000
- CORS is already configured

### "Cannot find module 'express'"
```bash
cd backend
npm install
# or
npm install --legacy-peer-deps
```

### "Blank dashboard after login"
- Log out and log back in
- Check browser console for errors (F12)
- Check backend logs for API errors

---

## 🔄 Stopping the Application

**To stop all services:**

1. **Backend Terminal:** Press `Ctrl + C`
2. **Frontend Terminal:** Press `Ctrl + C`
3. **MongoDB Terminal:** Press `Ctrl + C` (if running locally)

---

## 📚 Configuration explained

### backend/.env Fields

| Field | Current Value | Purpose |
|-------|---------------|---------|
| PORT | 5000 | Backend server port |
| MONGODB_URI | mongodb://localhost:27017/job_tracker | Database connection |
| JWT_SECRET | smart_job_tracker_secret_2026_dev_key_12345 | Auth token encryption |
| JWT_EXPIRY | 7d | Token expiration time |
| NODE_ENV | development | Environment mode |

### To use MongoDB Atlas instead of local:

1. [Create MongoDB Atlas account](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string: `mongodb+srv://username:password@...`
4. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job_tracker?retryWrites=true&w=majority
```

---

## 🚀 You're all set!

If everything is configured correctly, you should now have:

✅ Backend API running on http://localhost:5000  
✅ Frontend app running on http://localhost:3000  
✅ MongoDB database connected  
✅ Authentication working  
✅ Job tracker ready to use  
✅ Resume analyzer ready to test  

**Enjoy tracking your job search! 🎉**

---

## 📞 Need Help?

1. Check [QUICK_START.md](./QUICK_START.md)
2. Read [explanation.txt](./explanation.txt)
3. Check terminal output for error messages
4. Review [backend/README.md](./backend/README.md)
5. Review [frontend/README.md](./frontend/README.md)

---

**Version**: 1.0.0  
**Last Updated**: March 28, 2026  
**Status**: Ready to Run ✅
