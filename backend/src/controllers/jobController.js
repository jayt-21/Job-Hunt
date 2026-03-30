const jobService = require('../services/jobService');

class JobController {
  async createJob(req, res) {
    try {
      const { company, position, status, salary, notes, url } = req.body;

      if (!company || !position) {
        return res.status(400).json({
          success: false,
          message: 'Company and position are required',
        });
      }

      const jobData = {
        company,
        position,
        status,
        salary,
        notes,
        url,
      };

      // Handle resume upload if file exists
      if (req.file) {
        jobData.resume = {
          fileName: req.file.originalname,
          fileData: req.file.buffer.toString('base64'),
          fileSize: req.file.size,
          uploadedDate: new Date(),
        };
      }

      const job = await jobService.createJob(req.userId, jobData);

      return res.status(201).json({
        success: true,
        message: 'Job application created',
        data: job,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getUserJobs(req, res) {
    try {
      const jobs = await jobService.getUserJobs(req.userId);

      return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getJobById(req, res) {
    try {
      const { jobId } = req.params;
      const job = await jobService.getJobById(jobId, req.userId);

      return res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateJob(req, res) {
    try {
      const { jobId } = req.params;
      const job = await jobService.updateJob(jobId, req.userId, req.body);

      return res.status(200).json({
        success: true,
        message: 'Job updated successfully',
        data: job,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteJob(req, res) {
    try {
      const { jobId } = req.params;
      await jobService.deleteJob(jobId, req.userId);

      return res.status(200).json({
        success: true,
        message: 'Job deleted successfully',
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAnalytics(req, res) {
    try {
      const analytics = await jobService.getAnalytics(req.userId);

      return res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async uploadResume(req, res) {
    try {
      const { jobId } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const job = await jobService.updateJob(jobId, req.userId, {
        resume: {
          fileName: req.file.originalname,
          fileData: req.file.buffer.toString('base64'),
          fileSize: req.file.size,
          uploadedDate: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Resume uploaded successfully',
        data: job,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async downloadResume(req, res) {
    try {
      const { jobId } = req.params;
      const job = await jobService.getJobById(jobId, req.userId);

      if (!job.resume || !job.resume.fileData) {
        return res.status(404).json({
          success: false,
          message: 'No resume found for this job',
        });
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(job.resume.fileData, 'base64');
      const fileName = job.resume.fileName || 'resume.pdf';

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new JobController();
