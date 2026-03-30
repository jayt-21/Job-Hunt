const mongoose = require('mongoose');
const crypto = require('crypto');

const PasswordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    email: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true
    },
    isUsed: {
      type: Boolean,
      default: false
    },
    usedAt: Date,
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 } // Auto-delete after expiry (3600 = 1 hour)
    },
    ipAddress: String,
    userAgent: String
  },
  { timestamps: true }
);

/**
 * Generate a secure reset token
 */
PasswordResetSchema.statics.generateResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  
  return { token, tokenHash, expiresAt };
};

/**
 * Verify reset token
 */
PasswordResetSchema.statics.verifyResetToken = async function(token, userId) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  
  const resetRecord = await this.findOne({
    userId,
    tokenHash,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });

  return resetRecord;
};

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
