const express = require('express');
const multer = require('multer');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'text/plain'];
    const allowedExts = ['pdf', 'txt'];
    
    const ext = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// All routes require authentication
router.use(authMiddleware);

// Resume analysis routes
router.post('/upload', upload.single('file'), resumeController.uploadResume);
router.post('/analyze', resumeController.analyzeResume);
router.post('/optimize', resumeController.optimizeResume);
router.get('/history', resumeController.getAnalysisHistory);
router.get('/:analysisId', resumeController.getAnalysisById);

module.exports = router;
