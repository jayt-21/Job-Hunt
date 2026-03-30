const JobApplication = require('../models/JobApplication');

class JobService {
  // Create job application
  async createJob(userId, jobData) {
    const job = new JobApplication({
      userId,
      ...jobData,
    });

    await job.save();
    return job;
  }

  // Get all jobs for user
  async getUserJobs(userId) {
    const jobs = await JobApplication.find({ userId }).sort({
      appliedDate: -1,
    });
    return jobs;
  }

  // Get single job
  async getJobById(jobId, userId) {
    const job = await JobApplication.findOne({
      _id: jobId,
      userId,
    });

    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  }

  // Update job
  async updateJob(jobId, userId, jobData) {
    const job = await JobApplication.findOneAndUpdate(
      { _id: jobId, userId },
      jobData,
      { new: true, runValidators: true }
    );

    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  }

  // Delete job
  async deleteJob(jobId, userId) {
    const job = await JobApplication.findOneAndDelete({
      _id: jobId,
      userId,
    });

    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  }

  // Get analytics for user
  async getAnalytics(userId) {
    const jobs = await JobApplication.find({ userId });

    const analytics = {
      totalApplications: jobs.length,
      byStatus: {
        applied: jobs.filter(j => j.status === 'applied').length,
        interview: jobs.filter(j => j.status === 'interview').length,
        rejected: jobs.filter(j => j.status === 'rejected').length,
        offer: jobs.filter(j => j.status === 'offer').length,
      },
      successRate:
        jobs.length > 0
          ? ((jobs.filter(j => j.status === 'offer').length / jobs.length) * 100).toFixed(2)
          : 0,
    };

    return analytics;
  }
}

module.exports = new JobService();
