const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const ApiError = require('../utils/ApiError');

class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password }) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    // Create user (password hashing happens in the pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate token
    const token = this._generateToken(user._id);

    return {
      user,
      token,
    };
  }

  /**
   * Login with email and password
   */
  async login({ email, password }) {
    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Contact an admin.');
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate token
    const token = this._generateToken(user._id);

    return {
      user,
      token,
    };
  }

  /**
   * Logout - blacklist the current token
   */
  async logout(token) {
    // Decode token to get its expiry
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    // Add token to blacklist
    await TokenBlacklist.create({ token, expiresAt });

    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user profile
   */
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  /**
   * Generate JWT token
   */
  _generateToken(userId) {
    return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }
}

module.exports = new AuthService();
