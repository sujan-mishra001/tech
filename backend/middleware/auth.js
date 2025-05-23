const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;    console.log('Auth headers:', req.headers.authorization);
    console.log('Auth cookies:', req.cookies);
    
    // Check for token in authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Found token in header:', token);
    }
    // Then check cookies as fallback
    else if (req.cookies.token) {
      token = req.cookies.token;
      console.log('Found token in cookies:', token);
    }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development');

    if (!decoded || !decoded.id) {
      console.error('Invalid token structure:', decoded);
      return res.status(401).json({
        success: false,
        error: 'Invalid token structure'
      });
    }

    // Get user from the token
    const user = await User.findById(decoded.id);
    console.log('Found user:', user ? 'yes' : 'no', 'for id:', decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // Set user in request for use in protected routes
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    
    next();
  };
};