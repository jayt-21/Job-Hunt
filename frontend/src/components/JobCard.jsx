import React, { useState } from 'react';
import { Trash2, Edit2, ExternalLink, Download, Eye } from 'lucide-react';
import { jobAPI } from '../services/api';

export const JobCard = ({ job, onDeleted }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [editStatus, setEditStatus] = useState(job.status);
  const [isDownloading, setIsDownloading] = useState(false);

  const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    interview: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
    offer: 'bg-green-100 text-green-800',
  };

  const handleStatusChange = async () => {
    if (editStatus === job.status) return;

    try {
      setIsUpdating(true);
      await jobAPI.updateJob(job._id, { status: editStatus });
      onDeleted();
    } catch (error) {
      console.error('Failed to update job:', error);
      setEditStatus(job.status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(job._id);
        onDeleted();
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  const handleViewResume = async () => {
    try {
      setIsDownloading(true);
      const response = await jobAPI.downloadResume(job._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url);
    } catch (error) {
      console.error('Failed to view resume:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadResume = async () => {
    try {
      setIsDownloading(true);
      const response = await jobAPI.downloadResume(job._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', job.resume?.fileName || 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Failed to download resume:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{job.company}</h3>
          <p className="text-gray-600">{job.position}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2 items-center mb-2">
          <label className="text-sm font-semibold text-gray-700">Status:</label>
          <select
            value={editStatus}
            onChange={(e) => {
              setEditStatus(e.target.value);
            }}
            onBlur={handleStatusChange}
            disabled={isUpdating}
            className={`${statusColors[editStatus]} px-2 py-1 rounded text-sm font-semibold border-0 cursor-pointer`}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="offer">Offer</option>
          </select>
        </div>
      </div>

      {job.salary && (
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Salary:</span> ${job.salary.toLocaleString()}
        </p>
      )}

      {job.notes && (
        <p className="text-gray-700 mb-2 text-sm">
          <span className="font-semibold">Notes:</span> {job.notes}
        </p>
      )}

      <p className="text-gray-500 text-sm mb-4">
        Applied on {new Date(job.appliedDate).toLocaleDateString()}
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm hover:underline"
          >
            View Job <ExternalLink size={16} />
          </a>
        )}

        {job.resume?.fileData && (
          <>
            <button
              onClick={handleViewResume}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 text-green-500 hover:text-green-700 text-sm hover:underline disabled:opacity-50"
            >
              <Eye size={16} /> View Resume
            </button>
            <button
              onClick={handleDownloadResume}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-700 text-sm hover:underline disabled:opacity-50"
            >
              <Download size={16} /> Download Resume
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default JobCard;
