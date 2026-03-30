# Smart Job Tracker + Resume Analyzer - Frontend

Frontend built with React, Tailwind CSS, and Vite.

## Features

- User authentication (Register/Login)
- Dashboard with job analytics
- Job application tracking with Kanban-style status
- Resume analyzer with ATS scoring
- Real-time job statistics

## Setup

### Prerequisites
- Node.js (v14+)
- Backend API running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

3. Build for production:
```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API calls
│   ├── context/        # React Context (Auth)
│   ├── hooks/          # Custom hooks
│   ├── App.jsx         # Main app
│   ├── App.css         # App styles
│   └── index.css       # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Key Components

### Pages
- **Login** - User login page
- **Register** - User registration page
- **Dashboard** - Main dashboard with job tracker
- **ResumeAnalyzer** - Resume analysis tool

### Components
- **Navbar** - Navigation bar
- **JobForm** - Form to add new job
- **JobCard** - Job card display with status update

## API Integration

API calls are centralized in `src/services/api.js` using Axios.

Authentication token is automatically added to requests via interceptor.

## Design System

Built with Tailwind CSS:
- Color scheme: Blue/Purple primary
- Responsive grid layouts
- Lucide icons for UI elements
- Mobile-first approach

## Key Design Decisions

1. **Context API**: Simple state management for authentication
2. **Custom Hooks**: `useAuth` for accessing auth context
3. **Tailwind CSS**: Utility-first CSS for rapid development
4. **Vite**: Fast build tool and dev server
5. **React Router**: Client-side routing

## Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token added to API request headers via interceptor
5. Protected routes check for token

## Limitations

- No offline support
- No caching strategy
- Limited error handling UI
- No file upload UI for PDFs

## Future Improvements

- Dark mode support
- Export job data to CSV/PDF
- Calendar view for applications
- Interview preparation guide
- Job board integrations
- Mobile app version
- Offline support with service workers
