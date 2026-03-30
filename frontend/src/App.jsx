import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import SecuritySettings from './pages/SecuritySettings';
import PasswordReset from './pages/PasswordReset';
import Navbar from './components/Navbar';
import './App.css';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const auth = React.useContext(AuthContext);

  return (
    <>
      {auth.isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={
            auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
          }
        />
        <Route
          path="/password-reset"
          element={<PasswordReset />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-analyzer"
          element={
            <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security"
          element={
            <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
              <SecuritySettings />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
