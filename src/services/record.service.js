const FinancialRecord = require('../models/FinancialRecord');
const ApiError = require('../utils/ApiError');
const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('../utils/constants');

class RecordService {
  /**
   * Create a new financial record
   */
  async createRecord(recordData, userId) {
    const record = await FinancialRecord.create({
      ...recordData,
      createdBy: userId,
    });

    return record;
  }

  /**
   * Get all records with filtering, searching, sorting, and pagination
   */
  async getAllRecords(queryParams) {
    const {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      type,
      category,
      startDate,
      endDate,
      search,
      sortBy = 'date',
      order = 'desc',
    } = queryParams;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter = { isDeleted: false };

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const allowedSortFields = ['date', 'amount', 'createdAt', 'category', 'type'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
    const sort = { [sortField]: sortOrder };

    const [records, total] = await Promise.all([
      FinancialRecord.find(filter)
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      FinancialRecord.countDocuments(filter),
    ]);

    return {
      records,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get a single record by ID
   */
  async getRecordById(recordId) {
    const record = await FinancialRecord.findOne({
      _id: recordId,
      isDeleted: false,
    }).populate('createdBy', 'name email');

    if (!record) {
      throw ApiError.notFound('Financial record not found');
    }

    return record;
  }

  /**
   * Update a financial record
   */
  async updateRecord(recordId, updateData) {
    // Prevent updating system fields
    delete updateData.createdBy;
    delete updateData.isDeleted;
    delete updateData.deletedAt;

    const record = await FinancialRecord.findOneAndUpdate(
      { _id: recordId, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!record) {
      throw ApiError.notFound('Financial record not found');
    }

    return record;
  }

  /**
   * Soft delete a financial record
   */
  async deleteRecord(recordId) {
    const record = await FinancialRecord.findOneAndUpdate(
      { _id: recordId, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!record) {
      throw ApiError.notFound('Financial record not found');
    }

    return { message: 'Record deleted successfully' };
  }
}

module.exports = new RecordService();
