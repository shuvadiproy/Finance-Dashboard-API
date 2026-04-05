const dashboardService = require('../services/dashboard.service');
const ApiResponse = require('../utils/ApiResponse');

class DashboardController {
  /**
   * GET /api/dashboard/summary
   */
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();

      return ApiResponse.success(res, {
        message: 'Dashboard summary retrieved successfully',
        data: { summary },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/category-summary
   */
  async getCategorySummary(req, res, next) {
    try {
      const categorySummary = await dashboardService.getCategorySummary();

      return ApiResponse.success(res, {
        message: 'Category summary retrieved successfully',
        data: { categorySummary },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/trends
   */
  async getTrends(req, res, next) {
    try {
      const trends = await dashboardService.getTrends();

      return ApiResponse.success(res, {
        message: 'Monthly trends retrieved successfully',
        data: { trends },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/recent
   */
  async getRecentActivity(req, res, next) {
    try {
      const recentActivity = await dashboardService.getRecentActivity();

      return ApiResponse.success(res, {
        message: 'Recent activity retrieved successfully',
        data: { recentActivity },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
