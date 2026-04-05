const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const ApiError = require('../utils/ApiError');

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    // 2. Check if token is blacklisted (logged out)
    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted) {
      throw ApiError.unauthorized('Token has been revoked. Please login again.');
    }

    // 3. Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // 4. Check if user still exists and is active
    const user = await User.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Contact an admin.');
    }

    // 5. Attach user and token to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token has expired. Please login again.'));
    }
    next(error);
  }
};

module.exports = authenticate;
