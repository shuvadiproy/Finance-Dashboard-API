const recordService = require('../services/record.service');
const ApiResponse = require('../utils/ApiResponse');

class RecordController {
  /**
   * POST /api/records
   */
  async createRecord(req, res, next) {
    try {
      const record = await recordService.createRecord(req.body, req.user._id);

      return ApiResponse.created(res, {
        message: 'Financial record created successfully',
        data: { record },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/records
   */
  async getAllRecords(req, res, next) {
    try {
      const result = await recordService.getAllRecords(req.query);

      return ApiResponse.success(res, {
        message: 'Financial records retrieved successfully',
        data: { records: result.records },
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/records/:id
   */
  async getRecordById(req, res, next) {
    try {
      const record = await recordService.getRecordById(req.params.id);

      return ApiResponse.success(res, {
        message: 'Financial record retrieved successfully',
        data: { record },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/records/:id
   */
  async updateRecord(req, res, next) {
    try {
      const record = await recordService.updateRecord(req.params.id, req.body);

      return ApiResponse.success(res, {
        message: 'Financial record updated successfully',
        data: { record },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/records/:id
   */
  async deleteRecord(req, res, next) {
    try {
      const result = await recordService.deleteRecord(req.params.id);

      return ApiResponse.success(res, {
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecordController();
