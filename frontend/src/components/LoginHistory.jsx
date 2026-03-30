import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, MapPin, Globe } from 'lucide-react';
import { authAPI } from '../services/api';

const LoginHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const fetchLoginHistory = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getLoginHistory(20);
      setHistory(response.data.data || []);
    } catch (err) {
      setError('Failed to load login history: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const getSuccessIcon = (success) => {
    return success ? (
      <CheckCircle className="text-green-500" size={20} />
    ) : (
      <AlertCircle className="text-red-500" size={20} />
    );
  };

  const formatIp = (ip) => {
    if (!ip) return 'Unknown';
    // Hide last octet for privacy
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
  };

  const timeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading login history...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Login History</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No login history available</p>
        ) : (
          history.map((entry, idx) => (
            <div
              key={idx}
              className={`flex gap-4 p-4 border-l-4 rounded transition ${
                entry.success
                  ? 'border-l-green-500 bg-green-50 hover:bg-green-100'
                  : 'border-l-red-500 bg-red-50 hover:bg-red-100'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {getSuccessIcon(entry.success)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {entry.success ? 'Successful Login' : 'Failed Login Attempt'}
                    </h3>
                    <p className="text-sm text-gray-700 mt-1">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {timeAgo(entry.timestamp)}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="font-mono">{formatIp(entry.ipAddress)}</span>
                  </div>

                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Globe size={16} className="text-gray-400" />
                    <span className="truncate" title={entry.userAgent}>
                      {entry.userAgent?.substring(0, 40)}...
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Security Tips */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="text-blue-600 font-bold">•</span>
            <span>Review this list regularly to spot unauthorized access</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-600 font-bold">•</span>
            <span>If you see unfamiliar logins, change your password immediately</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-600 font-bold">•</span>
            <span>Failed login attempts from your IP are expected if you mistyped your password</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-600 font-bold">•</span>
            <span>Use the Sessions page to logout from devices you no longer use</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoginHistory;
