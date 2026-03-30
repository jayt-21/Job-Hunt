const express = require('express');
const multer = require('multer');
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for resume uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf'];
    const allowedExts = ['pdf'];
    
    const ext = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for resume upload'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// All routes require authentication
router.use(authMiddleware);

// CRUD operations (analytics must come before :jobId)
router.post('/', upload.single('resume'), jobController.createJob);
router.get('/analytics', jobController.getAnalytics);
router.get('/', jobController.getUserJobs);
router.get('/:jobId', jobController.getJobById);
router.put('/:jobId', jobController.updateJob);
router.post('/:jobId/resume', upload.single('resume'), jobController.uploadResume);
router.get('/:jobId/resume/download', jobController.downloadResume);
router.delete('/:jobId', jobController.deleteJob);

module.exports = router;
