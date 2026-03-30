/**
 * Frontend Password Validator
 * Mirrors backend validation for immediate user feedback
 */

export const validatePassword = (password) => {
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

  // Check for common patterns
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

  const strengthLevels = {
    0: { label: 'Very Weak', color: 'bg-red-600' },
    1: { label: 'Weak', color: 'bg-red-500' },
    2: { label: 'Fair', color: 'bg-orange-500' },
    3: { label: 'Good', color: 'bg-yellow-500' },
    4: { label: 'Strong', color: 'bg-green-500' },
    5: { label: 'Very Strong', color: 'bg-green-600' },
    6: { label: 'Very Strong', color: 'bg-green-600' },
    7: { label: 'Very Strong', color: 'bg-green-600' }
  };

  const strengthData = strengthLevels[strength];

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    strength: strengthData.label,
    strengthScore: Math.round((strength / 7) * 100),
    strengthColor: strengthData.color
  };
};
