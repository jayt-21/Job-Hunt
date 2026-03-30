const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { rateLimitMiddleware } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

// Public routes with rate limiting
router.post('/register', rateLimitMiddleware(10, 60 * 60 * 1000), authController.register); // 10 attempts per hour
router.post('/login', rateLimitMiddleware(5, 15 * 60 * 1000), authController.login); // 5 attempts per 15 minutes

// Password reset routes
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.get('/sessions', authMiddleware, authController.getSessions);
router.post('/logout-session', authMiddleware, authController.logoutSession);
router.post('/logout-all', authMiddleware, authController.logoutAllSessions);
router.get('/login-history', authMiddleware, authController.getLoginHistory);

module.exports = router;
