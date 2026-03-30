const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    deviceInfo: {
      userAgent: String,
      ipAddress: String,
      deviceType: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet', 'unknown'],
        default: 'unknown'
      },
      browser: String,
      os: String
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 } // TTL index - auto-delete expired sessions
    },
    isRevoked: {
      type: Boolean,
      default: false
    },
    revokedAt: Date,
    revokedReason: {
      type: String,
      enum: [null, 'user', 'logout-all', 'security', 'password-change'],
      default: null
    }
  },
  { timestamps: true }
);

// Index for finding user sessions
SessionSchema.index({ userId: 1, isRevoked: 1 });

module.exports = mongoose.model('Session', SessionSchema);
