const { verifyToken } = require('../utils/tokenUtils');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token =
      req.headers.authorization &&
      req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Attach userId to request
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

module.exports = authMiddleware;
