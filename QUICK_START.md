# Smart Job Tracker + Resume Analyzer - Quick Start Guide

## 60-Second Setup

### Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - get connection string from https://www.mongodb.com/cloud/atlas
```

### Terminal 1: Start Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
# Opens on http://localhost:3000
```

## Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## Test Credentials

Create a new account:
1. Go to Register page
2. Fill in details
3. Login with credentials

Or test with API:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Core Features

- **Authentication** - JWT-based login/register
- **Job Tracker** - Add, edit, delete job applications
- **Analytics** - View success rates and statistics
- **Resume Analyzer** - ATS score with keyword matching
- **Responsive UI** - Works on desktop and mobile

## Key Files

### Backend
- `src/server.js` - Express server entry point
- `src/config/database.js` - MongoDB connection
- `src/services/` - Business logic
- `src/controllers/` - HTTP handlers
- `src/models/` - Database schemas
- `tests/unit/` - Unit tests

### Frontend
- `src/App.jsx` - Main component
- `src/services/api.js` - API integration
- `src/context/AuthContext.jsx` - Auth state
- `src/pages/` - Page components
- `src/components/` - Reusable components

## Run Tests

```bash
cd backend
npm test

# Watch mode
npm run test:watch
```

## Full Documentation

- See `explanation.txt` in root for complete documentation
- See `backend/README.md` for backend details
- See `frontend/README.md` for frontend details

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Test connection: `mongosh "mongodb://localhost:27017"`

### CORS Error
- Backend should show CORS enabled in console
- Check frontend API calls match backend port

### Token Errors
- Clear localStorage in browser DevTools
- Log back in
- Check JWT_SECRET in .env matches

## Next Steps

1. **Add More Features**:
   - Email notifications
   - Resume PDF upload
   - Interview calendar
   - Salary tracking

2. **Deploy**:
   - Backend: Heroku, Render, Railway
   - Frontend: Vercel, Netlify
   - Database: MongoDB Atlas

3. **Optimize**:
   - Add caching (Redis)
   - Implement pagination
   - Add search/filter
   - Performance monitoring

## API Endpoints Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login user |
| GET | /api/auth/profile | Yes | Get profile |
| POST | /api/jobs | Yes | Create job |
| GET | /api/jobs | Yes | Get all jobs |
| GET | /api/jobs/analytics | Yes | Get analytics |
| PUT | /api/jobs/:id | Yes | Update job |
| DELETE | /api/jobs/:id | Yes | Delete job |
| POST | /api/resume/analyze | Yes | Analyze resume |
| GET | /api/resume/history | Yes | Get history |

## Key Concepts

**JWT Token**: Sent in header as `Authorization: Bearer {token}`
**ATS Score**: 0-100 match percentage of resume to job description
**Status Tracking**: Applied → Interview → Rejected/Offer
**Resume Analysis**: Keyword matching algorithm (see explanation.txt)

## Need Help?

1. Check error messages in browser console
2. Check server logs in terminal
3. Read explanation.txt for architecture details
4. Review README.md in backend/frontend folders
5. Check test files for usage examples

---

**Version**: 1.0.0 MVP
**Created**: March 28, 2026
**Stack**: React + Node.js + MongoDB + Tailwind CSS
