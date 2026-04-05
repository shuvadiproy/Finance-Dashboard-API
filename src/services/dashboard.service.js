const FinancialRecord = require('../models/FinancialRecord');

class DashboardService {
  /**
   * Get overall summary: total income, total expenses, net balance
   */
  async getSummary() {
    const result = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
          totalRecords: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: { $round: ['$totalIncome', 2] },
          totalExpenses: { $round: ['$totalExpenses', 2] },
          netBalance: {
            $round: [{ $subtract: ['$totalIncome', '$totalExpenses'] }, 2],
          },
          totalRecords: 1,
        },
      },
    ]);

    return (
      result[0] || {
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        totalRecords: 0,
      }
    );
  }

  /**
   * Get category-wise breakdown of income and expenses
   */
  async getCategorySummary() {
    const result = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.category',
          breakdown: {
            $push: {
              type: '$_id.type',
              total: { $round: ['$total', 2] },
              count: '$count',
            },
          },
          categoryTotal: { $sum: '$total' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          categoryTotal: { $round: ['$categoryTotal', 2] },
          breakdown: 1,
        },
      },
      { $sort: { categoryTotal: -1 } },
    ]);

    return result;
  }

  /**
   * Get monthly trends for the last 12 months
   */
  async getTrends() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const result = await FinancialRecord.aggregate([
      {
        $match: {
          isDeleted: false,
          date: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          income: { $round: ['$income', 2] },
          expenses: { $round: ['$expenses', 2] },
          net: {
            $round: [{ $subtract: ['$income', '$expenses'] }, 2],
          },
          count: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    return result;
  }

  /**
   * Get recent transactions (last 10)
   */
  async getRecentActivity() {
    const records = await FinancialRecord.find({ isDeleted: false })
      .populate('createdBy', 'name email')
      .sort({ date: -1, createdAt: -1 })
      .limit(10);

    return records;
  }
}

module.exports = new DashboardService();
