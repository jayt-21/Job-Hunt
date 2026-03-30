import React, { useState } from 'react';
import { Shield, Lock, Smartphone, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import SessionManagement from '../components/SessionManagement';
import LoginHistory from '../components/LoginHistory';

const SecuritySettings = () => {
  const [expandedSection, setExpandedSection] = useState('sessions');
  const colorClasses = {
    blue: {
      activeCard: 'border-blue-500 bg-blue-50',
      icon: 'text-blue-600',
    },
    green: {
      activeCard: 'border-green-500 bg-green-50',
      icon: 'text-green-600',
    },
    purple: {
      activeCard: 'border-purple-500 bg-purple-50',
      icon: 'text-purple-600',
    },
  };

  const sections = [
    {
      id: 'sessions',
      title: 'Active Sessions',
      icon: <Smartphone size={24} />,
      description: 'View and manage your active sessions across devices',
      color: 'blue'
    },
    {
      id: 'history',
      title: 'Login History',
      icon: <Clock size={24} />,
      description: 'Review your recent login activity and IP addresses',
      color: 'green'
    },
    {
      id: 'password',
      title: 'Password Security',
      icon: <Lock size={24} />,
      description: 'Change your password and manage password recovery options',
      color: 'purple'
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-blue-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-900">Security Settings</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your account security, sessions, and login history
          </p>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition hover:shadow-lg ${
                expandedSection === section.id
                  ? colorClasses[section.color].activeCard
                  : 'border-gray-200 bg-white'
              }`}
              onClick={() => toggleSection(section.id)}
            >
              <div className={`${colorClasses[section.color].icon} mb-3`}>
                {section.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{section.description}</p>
            </div>
          ))}
        </div>

        {/* Expandable Sections */}
        <div className="space-y-6">
          {/* Sessions Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('sessions')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <Smartphone className="text-blue-600" size={28} />
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">Active Sessions</h2>
                  <p className="text-gray-600 text-sm">View and manage devices using your account</p>
                </div>
              </div>
              {expandedSection === 'sessions' ? (
                <ChevronUp size={24} className="text-gray-400" />
              ) : (
                <ChevronDown size={24} className="text-gray-400" />
              )}
            </button>

            {expandedSection === 'sessions' && (
              <div className="border-t border-gray-200 p-6">
                <SessionManagement />
              </div>
            )}
          </div>

          {/* Login History Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('history')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <Clock className="text-green-600" size={28} />
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">Login History</h2>
                  <p className="text-gray-600 text-sm">Review successful and failed login attempts</p>
                </div>
              </div>
              {expandedSection === 'history' ? (
                <ChevronUp size={24} className="text-gray-400" />
              ) : (
                <ChevronDown size={24} className="text-gray-400" />
              )}
            </button>

            {expandedSection === 'history' && (
              <div className="border-t border-gray-200 p-6">
                <LoginHistory />
              </div>
            )}
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('password')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <Lock className="text-purple-600" size={28} />
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">Password Security</h2>
                  <p className="text-gray-600 text-sm">Update your password and recovery options</p>
                </div>
              </div>
              {expandedSection === 'password' ? (
                <ChevronUp size={24} className="text-gray-400" />
              ) : (
                <ChevronDown size={24} className="text-gray-400" />
              )}
            </button>

            {expandedSection === 'password' && (
              <div className="border-t border-gray-200 p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <Lock className="mx-auto text-blue-600 mb-4" size={40} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Your Password</h3>
                  <p className="text-gray-600 mb-4">
                    To change your password, use the password reset feature
                  </p>
                  <a
                    href="/password-reset"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                  >
                    Reset Password
                  </a>
                </div>

                {/* Password Tips */}
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Password Best Practices</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Use at least 8 characters (12+ is better)</span>
                    </li>
                    <li className="flex gap-3 text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Mix uppercase, lowercase, numbers, and special characters</span>
                    </li>
                    <li className="flex gap-3 text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Avoid common patterns like 123456 or password</span>
                    </li>
                    <li className="flex gap-3 text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Don't reuse passwords from other accounts</span>
                    </li>
                    <li className="flex gap-3 text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Change your password at least once every 6 months</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Tips Footer */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 General Security Tips</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Never share your password with anyone, including support staff</li>
            <li>• Enable logout from all sessions if you suspect unauthorized access</li>
            <li>• Regularly review your login history for suspicious activity</li>
            <li>• Use unique passwords for each of your online accounts</li>
            <li>• Keep your browser and operating system updated with security patches</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
