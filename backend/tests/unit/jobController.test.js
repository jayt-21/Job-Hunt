const jobController = require('../../src/controllers/jobController');
const jobService = require('../../src/services/jobService');

jest.mock('../../src/services/jobService');

describe('JobController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      userId: 'user123',
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createJob', () => {
    it('should create a new job application', async () => {
      req.body = {
        company: 'Tech Corp',
        position: 'Engineer',
        salary: 100000,
      };

      const mockJob = {
        _id: 'job1',
        userId: 'user123',
        company: 'Tech Corp',
        position: 'Engineer',
        salary: 100000,
      };

      jobService.createJob.mockResolvedValue(mockJob);

      await jobController.createJob(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Job application created',
        data: mockJob,
      });
    });

    it('should return error if company is missing', async () => {
      req.body = {
        position: 'Engineer',
      };

      await jobController.createJob(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Company and position are required',
      });
    });
  });

  describe('getUserJobs', () => {
    it('should get all jobs for user', async () => {
      const mockJobs = [
        { _id: 'job1', company: 'Tech Corp', position: 'Engineer' },
        { _id: 'job2', company: 'StartUp Inc', position: 'Developer' },
      ];

      jobService.getUserJobs.mockResolvedValue(mockJobs);

      await jobController.getUserJobs(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockJobs,
      });
    });
  });

  describe('updateJob', () => {
    it('should update a job', async () => {
      req.params.jobId = 'job1';
      req.body = { status: 'interview' };

      const mockJob = {
        _id: 'job1',
        company: 'Tech Corp',
        position: 'Engineer',
        status: 'interview',
      };

      jobService.updateJob.mockResolvedValue(mockJob);

      await jobController.updateJob(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Job updated successfully',
        data: mockJob,
      });
    });
  });

  describe('deleteJob', () => {
    it('should delete a job', async () => {
      req.params.jobId = 'job1';

      jobService.deleteJob.mockResolvedValue(true);

      await jobController.deleteJob(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Job deleted successfully',
      });
    });
  });

  describe('getAnalytics', () => {
    it('should get user analytics', async () => {
      const mockAnalytics = {
        totalApplications: 10,
        byStatus: {
          applied: 5,
          interview: 3,
          rejected: 1,
          offer: 1,
        },
        successRate: '10.00',
      };

      jobService.getAnalytics.mockResolvedValue(mockAnalytics);

      await jobController.getAnalytics(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockAnalytics,
      });
    });
  });
});
