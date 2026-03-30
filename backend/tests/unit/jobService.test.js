const jobService = require('../../src/services/jobService');
const JobApplication = require('../../src/models/JobApplication');

jest.mock('../../src/models/JobApplication');

describe('JobService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createJob', () => {
    it('should create a new job application', async () => {
      const mockJob = {
        _id: 'job123',
        userId: 'user123',
        company: 'Tech Corp',
        position: 'Software Engineer',
        status: 'applied',
        save: jest.fn().mockResolvedValue({}),
      };

      JobApplication.mockImplementation(() => mockJob);

      const result = await jobService.createJob('user123', {
        company: 'Tech Corp',
        position: 'Software Engineer',
      });

      expect(result.company).toBe('Tech Corp');
      expect(result.position).toBe('Software Engineer');
      expect(mockJob.save).toHaveBeenCalled();
    });
  });

  describe('getUserJobs', () => {
    it('should get all jobs for a user', async () => {
      const mockJobs = [
        {
          _id: 'job1',
          company: 'Tech Corp',
          position: 'Engineer',
          status: 'applied',
        },
        {
          _id: 'job2',
          company: 'StartUp Inc',
          position: 'Developer',
          status: 'interview',
        },
      ];

      JobApplication.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockJobs),
      });

      const result = await jobService.getUserJobs('user123');

      expect(result).toHaveLength(2);
      expect(JobApplication.find).toHaveBeenCalledWith({ userId: 'user123' });
    });
  });

  describe('getAnalytics', () => {
    it('should calculate analytics correctly', async () => {
      const mockJobs = [
        { status: 'applied' },
        { status: 'applied' },
        { status: 'interview' },
        { status: 'rejected' },
        { status: 'offer' },
      ];

      JobApplication.find.mockResolvedValue(mockJobs);

      const analytics = await jobService.getAnalytics('user123');

      expect(analytics.totalApplications).toBe(5);
      expect(analytics.byStatus.applied).toBe(2);
      expect(analytics.byStatus.interview).toBe(1);
      expect(analytics.byStatus.rejected).toBe(1);
      expect(analytics.byStatus.offer).toBe(1);
      expect(analytics.successRate).toBe('20.00');
    });
  });

  describe('updateJob', () => {
    it('should update a job', async () => {
      const mockJob = {
        _id: 'job1',
        company: 'Tech Corp',
        status: 'interview',
      };

      JobApplication.findOneAndUpdate.mockResolvedValue(mockJob);

      const result = await jobService.updateJob('job1', 'user123', {
        status: 'interview',
      });

      expect(result.status).toBe('interview');
      expect(JobApplication.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should throw error if job not found', async () => {
      JobApplication.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        jobService.updateJob('invalidId', 'user123', { status: 'interview' })
      ).rejects.toThrow('Job not found');
    });
  });

  describe('deleteJob', () => {
    it('should delete a job', async () => {
      const mockJob = {
        _id: 'job1',
        company: 'Tech Corp',
      };

      JobApplication.findOneAndDelete.mockResolvedValue(mockJob);

      const result = await jobService.deleteJob('job1', 'user123');

      expect(result._id).toBe('job1');
      expect(JobApplication.findOneAndDelete).toHaveBeenCalled();
    });

    it('should throw error if job not found', async () => {
      JobApplication.findOneAndDelete.mockResolvedValue(null);

      await expect(jobService.deleteJob('invalidId', 'user123')).rejects.toThrow(
        'Job not found'
      );
    });
  });
});
