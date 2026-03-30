import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  getSessions: () => api.get('/auth/sessions'),
  logoutSession: (sessionId) => api.post('/auth/logout-session', { sessionId }),
  logoutAll: () => api.post('/auth/logout-all'),
  getLoginHistory: (limit = 20) => api.get(`/auth/login-history?limit=${limit}`),
  requestPasswordReset: (email) => api.post('/auth/request-password-reset', { email }),
  resetPassword: (token, newPassword, confirmPassword) => 
    api.post('/auth/reset-password', { token, newPassword, confirmPassword }),
};

// Job APIs
export const jobAPI = {
  createJob: (data) => {
    const formData = new FormData();
    formData.append('company', data.company);
    formData.append('position', data.position);
    formData.append('status', data.status);
    if (data.salary) formData.append('salary', data.salary);
    if (data.notes) formData.append('notes', data.notes);
    if (data.url) formData.append('url', data.url);
    if (data.resumeFile) formData.append('resume', data.resumeFile);
    
    return api.post('/jobs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getJobs: () => api.get('/jobs'),
  getJob: (jobId) => api.get(`/jobs/${jobId}`),
  updateJob: (jobId, data) => api.put(`/jobs/${jobId}`, data),
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
  uploadResume: (jobId, file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post(`/jobs/${jobId}/resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  downloadResume: (jobId) => api.get(`/jobs/${jobId}/resume/download`, {
    responseType: 'blob',
  }),
  getAnalytics: () => api.get('/jobs/analytics'),
};

// Resume APIs
export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  analyze: (data) => api.post('/resume/analyze', data),
  optimize: (data) => api.post('/resume/optimize', data),
  getHistory: () => api.get('/resume/history'),
  getAnalysis: (analysisId) => api.get(`/resume/${analysisId}`),
};

export default api;
