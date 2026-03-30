const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    // Password reset tracking
    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },
    passwordHistory: [
      {
        password: String,
        changedAt: Date,
      }
    ],
    // Security settings
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockedUntil: Date,
    lastLogin: Date,
    loginHistory: [
      {
        ipAddress: String,
        userAgent: String,
        timestamp: Date,
        success: Boolean,
      }
    ],
    securityPreferences: {
      requiresPasswordChange: {
        type: Boolean,
        default: false,
      },
      allowRememberMe: {
        type: Boolean,
        default: true,
      },
      twoFactorEnabled: {
        type: Boolean,
        default: false,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Record failed login attempt
userSchema.methods.recordFailedLogin = async function(ipAddress, userAgent) {
  this.failedLoginAttempts = (this.failedLoginAttempts || 0) + 1;
  
  // Lock account after 5 failed attempts for 30 minutes
  if (this.failedLoginAttempts >= 5) {
    this.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
  }

  // Store login history
  this.loginHistory.push({
    ipAddress,
    userAgent,
    timestamp: new Date(),
    success: false
  });

  await this.save();
};

// Record successful login
userSchema.methods.recordSuccessfulLogin = async function(ipAddress, userAgent) {
  this.failedLoginAttempts = 0;
  this.accountLockedUntil = undefined;
  this.lastLogin = new Date();

  // Store login history
  this.loginHistory.push({
    ipAddress,
    userAgent,
    timestamp: new Date(),
    success: true
  });

  // Keep only last 50 login records
  if (this.loginHistory.length > 50) {
    this.loginHistory = this.loginHistory.slice(-50);
  }

  await this.save();
};

// Check if account is locked
userSchema.methods.isAccountLocked = function() {
  return this.accountLockedUntil && this.accountLockedUntil > new Date();
};

// Update password history
userSchema.methods.updatePasswordHistory = function() {
  // Store old password hash in history
  this.passwordHistory.push({
    password: this.password,
    changedAt: new Date()
  });

  // Keep only last 5 passwords
  if (this.passwordHistory.length > 5) {
    this.passwordHistory = this.passwordHistory.slice(-5);
  }

  this.lastPasswordChange = new Date();
};

module.exports = mongoose.model('User', userSchema);
