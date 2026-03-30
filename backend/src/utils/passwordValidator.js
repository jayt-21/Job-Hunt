/**
 * Password Strength Validator
 * Ensures passwords meet security requirements
 */

const validatePassword = (password) => {
  const errors = [];
  const warnings = [];

  // Check length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (password.length < 12) {
    warnings.push('Consider using 12+ characters for stronger security');
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for numbers
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  // Check for common patterns (to reject weak passwords)
  const commonPatterns = [
    '123456',
    'password',
    'qwerty',
    'abc123',
    '12345678',
    'admin',
    'letmein',
    'welcome',
    '111111'
  ];

  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    errors.push('Password contains common weak patterns');
  }

  // Calculate strength score
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (password.length >= 16) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

  const strengthLevel = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
    5: 'Very Strong',
    6: 'Very Strong',
    7: 'Very Strong'
  }[strength];

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    strength: strengthLevel,
    strengthScore: Math.round((strength / 7) * 100)
  };
};

module.exports = {
  validatePassword
};
