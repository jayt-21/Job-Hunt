import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Tablet, Laptop, X, LogOut, Clock } from 'lucide-react';
import { authAPI } from '../services/api';

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getSessions();
      setSessions(response.data.data || []);
    } catch (err) {
      setError('Failed to load sessions: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutSession = async (sessionId) => {
    try {
      setError('');
      await authAPI.logoutSession(sessionId);
      setSuccess('Session ended successfully');
      fetchSessions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to logout from session: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm('This will logout from all sessions. Continue?')) {
      return;
    }

    try {
      setError('');
      await authAPI.logoutAll();
      setSuccess('Logged out from all sessions. Please login again.');
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError('Failed to logout: ' + (err.response?.data?.message || err.message));
    }
  };

  const getDeviceIcon = (deviceType) => {
    const iconProps = { size: 24, className: 'text-blue-500' };
    
    switch (deviceType) {
      case 'mobile':
        return <Smartphone {...iconProps} />;
      case 'tablet':
        return <Tablet {...iconProps} />;
      case 'desktop':
        return <Monitor {...iconProps} />;
      default:
        return <Laptop {...iconProps} />;
    }
  };

  const formatDeviceInfo = (device) => {
    return `${device.deviceType?.charAt(0).toUpperCase() + device.deviceType?.slice(1) || 'Device'} from ${device.ipAddress}`;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading sessions...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Sessions</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-4 mb-6">
        {sessions.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No active sessions</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session._id}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex gap-4">
                {getDeviceIcon(session.deviceInfo?.deviceType)}
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {formatDeviceInfo(session.deviceInfo)}
                  </h3>
                  
                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                    <p>
                      <span className="font-medium">Browser:</span> {session.deviceInfo?.browser || 'Unknown'}
                    </p>
                    <p>
                      <span className="font-medium">OS:</span> {session.deviceInfo?.os || 'Unknown'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={14} />
                      <span className="font-medium">Last Active:</span> {new Date(session.lastActivity).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Expires:</span> {new Date(session.expiresAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLogoutSession(session._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                title="End this session"
              >
                <X size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Logout All Button */}
      {sessions.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleLogoutAll}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Logout from All Sessions
          </button>
          <p className="text-xs text-gray-600 mt-3 text-center">
            This will end all active sessions and require you to login again
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionManagement;
