import React, { useState } from 'react';
import { jobAPI } from '../services/api';
import { Upload, X } from 'lucide-react';

export const JobForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'applied',
    salary: '',
    notes: '',
    url: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed for resume');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Resume file must be less than 10MB');
        return;
      }
      setResumeFile(file);
      setResumeFileName(file.name);
      setError('');
    }
  };

  const removeResumeFile = () => {
    setResumeFile(null);
    setResumeFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await jobAPI.createJob({
        ...formData,
        salary: formData.salary ? parseInt(formData.salary) : undefined,
        resumeFile: resumeFile,
      });
      setFormData({
        company: '',
        position: '',
        status: 'applied',
        salary: '',
        notes: '',
        url: '',
      });
      setResumeFile(null);
      setResumeFileName('');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Add New Job Application
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Company Name *
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Google"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Position *
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Senior Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="offer">Offer</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Salary (Optional)
          </label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 100000"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">
            Job URL (Optional)
          </label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., https://..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any notes about this application..."
            rows="4"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">
            Applied Resume (Optional - PDF only)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded px-4 py-6 text-center hover:border-blue-500 transition">
            {!resumeFileName ? (
              <label className="cursor-pointer">
                <div className="flex justify-center mb-2">
                  <Upload size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                <p className="text-gray-400 text-sm">PDF (Max 10MB)</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
                <span className="text-sm text-gray-700 truncate">{resumeFileName}</span>
                <button
                  type="button"
                  onClick={removeResumeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition disabled:opacity-50"
        >
          {isLoading ? 'Adding Job...' : 'Add Job Application'}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
