const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // Validation
      if (!name || !email || !password || !confirmPassword) {
        return res
          .status(400)
          .json({ success: false, message: 'All fields are required' });
      }

      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ success: false, message: 'Passwords do not match' });
      }

      // Support both Express requests and lightweight test mocks.
      const ipAddress =
        req.ip ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        null;
      const userAgent = req.headers?.['user-agent'] || null;

      const result = await authService.register(name, email, password, ipAddress, userAgent);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      // Handle password validation errors
      if (error.errors && Array.isArray(error.errors)) {
        return res.status(400).json({
          success: false,
          message: error.message,
          errors: error.errors
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: 'Email and password are required' });
      }

      // Support both Express requests and lightweight test mocks.
      const ipAddress =
        req.ip ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        null;
      const userAgent = req.headers?.['user-agent'] || null;

      const result = await authService.login(email, password, ipAddress, userAgent);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await authService.getUserById(req.userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get active sessions for current user
  async getSessions(req, res) {
    try {
      const sessions = await authService.getActiveSessions(req.userId);

      return res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Logout from specific session
  async logoutSession(req, res) {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required',
        });
      }

      await authService.logoutSession(req.userId, sessionId);

      return res.status(200).json({
        success: true,
        message: 'Logged out from session',
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Logout from all sessions
  async logoutAllSessions(req, res) {
    try {
      await authService.logoutAllSessions(req.userId);

      return res.status(200).json({
        success: true,
        message: 'Logged out from all sessions',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Request password reset
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required',
        });
      }

      const result = await authService.requestPasswordReset(email);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token, newPassword, confirmPassword } = req.body;

      if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Token and passwords are required',
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match',
        });
      }

      const result = await authService.resetPassword(req.userId, token, newPassword);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        return res.status(400).json({
          success: false,
          message: error.message,
          errors: error.errors
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get login history
  async getLoginHistory(req, res) {
    try {
      const limit = req.query.limit || 20;
      const history = await authService.getLoginHistory(req.userId, limit);

      return res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
