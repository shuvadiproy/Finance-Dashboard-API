const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('../utils/constants');

class UserService {
  /**
   * Get all users with pagination
   */
  async getAllUsers({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT }) {
    page = Math.max(1, parseInt(page));
    limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit)));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  /**
   * Update a user
   */
  async updateUser(userId, updateData) {
    // Prevent password update through this endpoint
    delete updateData.password;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  /**
   * Toggle user active status
   */
  async updateUserStatus(userId, isActive, currentUserId) {
    // Prevent self-deactivation
    if (userId === currentUserId.toString()) {
      throw ApiError.badRequest('You cannot change your own status');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  /**
   * Delete a user
   */
  async deleteUser(userId, currentUserId) {
    // Prevent self-deletion
    if (userId === currentUserId.toString()) {
      throw ApiError.badRequest('You cannot delete your own account');
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}

module.exports = new UserService();
