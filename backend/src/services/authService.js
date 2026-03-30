const User = require('../models/User');
const Session = require('../models/Session');
const PasswordReset = require('../models/PasswordReset');
const { generateToken } = require('../utils/tokenUtils');
const { validatePassword } = require('../utils/passwordValidator');
const crypto = require('crypto');

class AuthService {
  // Register new user with password validation
  async register(name, email, password, ipAddress, userAgent) {
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const error = new Error('Password does not meet security requirements');
      error.errors = passwordValidation.errors;
      throw error;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Generate token and create session
    const token = generateToken(user._id);
    await this.createSession(user._id, token, ipAddress, userAgent);

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      token,
    };
  }

  // Login user with security tracking
  async login(email, password, ipAddress, userAgent) {
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      const remainingTime = Math.ceil((user.accountLockedUntil - new Date()) / 60000);
      throw new Error(`Account is locked. Try again in ${remainingTime} minutes.`);
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      await user.recordFailedLogin(ipAddress, userAgent);
      throw new Error('Invalid email or password');
    }

    // Record successful login
    await user.recordSuccessfulLogin(ipAddress, userAgent);

    // Generate token and create session
    const token = generateToken(user._id);
    await this.createSession(user._id, token, ipAddress, userAgent);

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      token,
    };
  }

  // Create session record
  async createSession(userId, token, ipAddress, userAgent) {
    // Simple device type detection without external library
    const deviceType = this.getDeviceType(userAgent);
    
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = new Session({
      userId,
      token,
      deviceInfo: {
        ipAddress,
        userAgent,
        deviceType,
        browser: 'Unknown',
        os: 'Unknown'
      },
      expiresAt
    });

    await session.save();
    return session;
  }

  // Get device type from user agent string
  getDeviceType(userAgent) {
    if (!userAgent) return 'desktop';
    
    const ua = userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipod/.test(ua)) {
      return 'mobile';
    }
    if (/ipad|tablet|kindle/.test(ua)) {
      return 'tablet';
    }
    
    return 'desktop';
  }

  // Get all active sessions for user
  async getActiveSessions(userId) {
    return await Session.find({
      userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    }).select('-token');
  }

  // Logout from specific session
  async logoutSession(userId, sessionId) {
    const session = await Session.findByIdAndUpdate(
      sessionId,
      {
        isRevoked: true,
        revokedAt: new Date(),
        revokedReason: 'user'
      },
      { new: true }
    );

    if (!session || session.userId.toString() !== userId) {
      throw new Error('Session not found');
    }

    return session;
  }

  // Logout from all sessions
  async logoutAllSessions(userId) {
    await Session.updateMany(
      { userId, isRevoked: false },
      {
        isRevoked: true,
        revokedAt: new Date(),
        revokedReason: 'logout-all'
      }
    );
  }

  // Request password reset
  async requestPasswordReset(email) {
    const user = await User.findOne({ email });
    
    if (!user) {
      // For security, don't reveal if email exists
      return { success: true, message: 'If email exists, reset link will be sent' };
    }

    // Generate reset token
    const { token, tokenHash, expiresAt } = PasswordReset.generateResetToken();

    const resetRecord = new PasswordReset({
      userId: user._id,
      email,
      token,
      tokenHash,
      expiresAt,
      ipAddress: null, // Will be set by controller
      userAgent: null
    });

    await resetRecord.save();

    // TODO: Send email with reset link
    // Email format: https://yourapp.com/reset-password?token={token}
    
    return {
      resetId: resetRecord._id,
      token, // In production, only send via email
      message: 'Check your email for password reset link'
    };
  }

  // Verify and reset password
  async resetPassword(userId, token, newPassword) {
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      const error = new Error('New password does not meet security requirements');
      error.errors = passwordValidation.errors;
      throw error;
    }

    // Verify reset token
    const resetRecord = await PasswordReset.verifyResetToken(token, userId);
    if (!resetRecord) {
      throw new Error('Invalid or expired password reset token');
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update password history and change password
    user.updatePasswordHistory();
    user.password = newPassword;
    user.securityPreferences.requiresPasswordChange = false;

    await user.save();

    // Mark reset token as used
    resetRecord.isUsed = true;
    resetRecord.usedAt = new Date();
    await resetRecord.save();

    // Logout from all sessions for security
    await this.logoutAllSessions(userId);

    return { success: true, message: 'Password reset successfully. Please login again.' };
  }

  // Get user by ID
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Get login history
  async getLoginHistory(userId, limit = 20) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.loginHistory.slice(-limit).reverse();
  }
}

module.exports = new AuthService();
