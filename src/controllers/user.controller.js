const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');

class UserController {
  /**
   * GET /api/users
   */
  async getAllUsers(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await userService.getAllUsers({ page, limit });

      return ApiResponse.success(res, {
        message: 'Users retrieved successfully',
        data: { users: result.users },
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);

      return ApiResponse.success(res, {
        message: 'User retrieved successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id
   */
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);

      return ApiResponse.success(res, {
        message: 'User updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/users/:id/status
   */
  async updateUserStatus(req, res, next) {
    try {
      const user = await userService.updateUserStatus(
        req.params.id,
        req.body.isActive,
        req.user._id
      );

      return ApiResponse.success(res, {
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id
   */
  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req.params.id, req.user._id);

      return ApiResponse.success(res, {
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
