import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, FileText } from 'lucide-react';
import { jobAPI } from '../services/api';
import JobCard from '../components/JobCard';
import JobForm from '../components/JobForm';

export const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchJobs();
    fetchAnalytics();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobAPI.getJobs();
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await jobAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleJobAdded = () => {
    setShowForm(false);
    fetchJobs();
    fetchAnalytics();
  };

  const handleJobDeleted = () => {
    fetchJobs();
    fetchAnalytics();
  };

  const filteredJobs = activeTab === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === activeTab);

  const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    interview: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
    offer: 'bg-green-100 text-green-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Job Tracker Dashboard</h1>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {analytics.totalApplications}
                  </p>
                </div>
                <BarChart3 className="text-blue-600" size={32} />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Success Rate</p>
                  <p className="text-3xl font-bold text-green-600">
                    {analytics.successRate}%
                  </p>
                </div>
                <BarChart3 className="text-green-600" size={32} />
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Interviews</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {analytics.byStatus.interview}
                  </p>
                </div>
                <BarChart3 className="text-yellow-600" size={32} />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Offers Received</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {analytics.byStatus.offer}
                  </p>
                </div>
                <BarChart3 className="text-purple-600" size={32} />
              </div>
            </div>
          </div>

          {/* Add Job Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-6 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <Plus size={20} />
            Add Job Application
          </button>

          {/* Job Form */}
          {showForm && (
            <JobForm onSuccess={handleJobAdded} />
          )}

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            {['All', 'Applied', 'Interview', 'Rejected', 'Offer'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 font-semibold border-b-2 transition ${
                  activeTab === tab.toLowerCase()
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Jobs Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No jobs found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map(job => (
                <JobCard
                  key={job._id}
                  job={job}
                  onDeleted={handleJobDeleted}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
