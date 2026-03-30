/**
 * Rate Limiting Middleware
 * Prevents brute force attacks and spam
 */

const rateLimit = new Map();

/**
 * Rate limiting middleware
 * Tracks failed login attempts by IP address
 */
const rateLimitMiddleware = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `${ip}-login`;
    const now = Date.now();

    // Get or initialize user's attempt data
    if (!rateLimit.has(key)) {
      rateLimit.set(key, { attempts: 0, resetTime: now + windowMs });
    }

    const userData = rateLimit.get(key);

    // Reset if window expired
    if (now > userData.resetTime) {
      rateLimit.set(key, { attempts: 0, resetTime: now + windowMs });
    }

    // Check if exceeded
    if (userData.attempts >= maxAttempts) {
      const secondsRemaining = Math.ceil((userData.resetTime - now) / 1000);
      return res.status(429).json({
        success: false,
        message: `Too many login attempts. Try again in ${secondsRemaining} seconds.`,
        retryAfter: secondsRemaining
      });
    }

    // Increment attempts on failed login
    req.recordAttempt = () => {
      userData.attempts++;
      rateLimit.set(key, userData);
    };

    // Reset attempts on successful login
    req.resetAttempts = () => {
      rateLimit.delete(key);
    };

    next();
  };
};

/**
 * Cleanup old entries periodically to prevent memory leaks
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key);
    }
  }
}, 60 * 1000); // Cleanup every minute

module.exports = {
  rateLimitMiddleware
};
