# Smart Job Tracker + Resume Analyzer - Backend

Backend API built with Node.js, Express, and MongoDB.

## Features

- JWT-based authentication
- Job application CRUD operations
- Job analytics and dashboard statistics
- Resume analysis with ATS scoring
- Keyword matching and suggestions

## Setup

### Prerequisites
- Node.js (v14+)
- MongoDB running locally or MongoDB Atlas

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job_tracker
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Job Applications
- `POST /api/jobs` - Create job application
- `GET /api/jobs` - Get all user jobs
- `GET /api/jobs/:jobId` - Get specific job
- `PUT /api/jobs/:jobId` - Update job
- `DELETE /api/jobs/:jobId` - Delete job
- `GET /api/jobs/analytics` - Get analytics

### Resume Analysis
- `POST /api/resume/analyze` - Analyze resume against job description
- `GET /api/resume/history` - Get analysis history
- `GET /api/resume/:analysisId` - Get specific analysis

## Project Structure

```
backend/
├── src/
│   ├── config/           # Database configuration
│   ├── controllers/      # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handlers
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── tests/
│   └── unit/            # Jest unit tests
├── .env                 # Environment variables
├── package.json
└── jest.config.js
```

## Testing

Run unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Key Design Decisions

1. **Service Layer Pattern**: Separates business logic from HTTP handling
2. **JWT Authentication**: Stateless, scalable auth using JSON Web Tokens
3. **Modular Routes**: Each feature has its own route file
4. **Error Handling**: Centralized error middleware for consistency
5. **Simple Resume Analyzer**: Keyword matching without heavy ML libraries

## Limitations

- Resume analyzer only does keyword matching (not NLP-based)
- No file upload handling for PDFs (plain text only)
- No email verification for registration
- No rate limiting implemented

## Future Improvements

- PDF parsing for resume uploads
- Email notification system
- Advanced ML-based resume scoring
- Integration with job boards API
- User profile customization
- Salary negotiation tracker
