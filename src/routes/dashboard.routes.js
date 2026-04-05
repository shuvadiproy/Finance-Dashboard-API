const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const { ROLES } = require('../utils/constants');

// All dashboard routes require authentication + analyst or admin role
router.use(authenticate);
router.use(authorize(ROLES.ANALYST, ROLES.ADMIN));

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard summary and analytics endpoints (Analyst & Admin only)
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get financial summary (total income, expenses, net balance)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalIncome:
 *                           type: number
 *                           example: 50000
 *                         totalExpenses:
 *                           type: number
 *                           example: 32000
 *                         netBalance:
 *                           type: number
 *                           example: 18000
 *                         totalRecords:
 *                           type: integer
 *                           example: 25
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (analyst or admin only)
 */
router.get('/summary', dashboardController.getSummary);

/**
 * @swagger
 * /api/dashboard/category-summary:
 *   get:
 *     summary: Get category-wise income/expense breakdown
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     categorySummary:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                             example: "Salary"
 *                           categoryTotal:
 *                             type: number
 *                             example: 25000
 *                           breakdown:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 type:
 *                                   type: string
 *                                 total:
 *                                   type: number
 *                                 count:
 *                                   type: integer
 */
router.get('/category-summary', dashboardController.getCategorySummary);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly income/expense trends (last 12 months)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     trends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           year:
 *                             type: integer
 *                             example: 2025
 *                           month:
 *                             type: integer
 *                             example: 3
 *                           income:
 *                             type: number
 *                             example: 8000
 *                           expenses:
 *                             type: number
 *                             example: 5500
 *                           net:
 *                             type: number
 *                             example: 2500
 *                           count:
 *                             type: integer
 *                             example: 12
 */
router.get('/trends', dashboardController.getTrends);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get 10 most recent transactions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     recentActivity:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FinancialRecord'
 */
router.get('/recent', dashboardController.getRecentActivity);

module.exports = router;
