const express = require('express');
const router = express.Router();
const recordController = require('../controllers/record.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createRecordValidator,
  updateRecordValidator,
  recordIdValidator,
} = require('../validators/record.validator');
const { ROLES } = require('../utils/constants');

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     FinancialRecord:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         amount:
 *           type: number
 *           example: 5000
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           example: "income"
 *         category:
 *           type: string
 *           example: "Salary"
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-03-15"
 *         description:
 *           type: string
 *           example: "Monthly salary payment"
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         isDeleted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Financial Records
 *   description: CRUD operations for financial records
 */

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *                 minimum: 0.01
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: "income"
 *               category:
 *                 type: string
 *                 enum: [Salary, Freelance, Investment, Food, Rent, Utilities, Transport, Healthcare, Entertainment, Shopping, Education, Travel, Insurance, Taxes, Savings, Other]
 *                 example: "Salary"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-03-15"
 *               description:
 *                 type: string
 *                 example: "Monthly salary payment"
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Record created successfully
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
 *                     record:
 *                       $ref: '#/components/schemas/FinancialRecord'
 *       403:
 *         description: Not authorized
 *       422:
 *         description: Validation error
 */
router.post(
  '/',
  authorize(ROLES.ADMIN),
  createRecordValidator,
  validate,
  recordController.createRecord
);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records with filtering & pagination (All roles)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page (max 100)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by record type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter records from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter records up to this date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, amount, createdAt, category, type]
 *           default: date
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Records retrieved successfully
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
 *                     records:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FinancialRecord'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get('/', recordController.getAllRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a specific financial record (All roles)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record retrieved successfully
 *       404:
 *         description: Record not found
 */
router.get('/:id', recordIdValidator, validate, recordController.getRecordById);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update a financial record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 6000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Record not found
 */
router.put(
  '/:id',
  authorize(ROLES.ADMIN),
  updateRecordValidator,
  validate,
  recordController.updateRecord
);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Soft-delete a financial record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Record not found
 */
router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  recordIdValidator,
  validate,
  recordController.deleteRecord
);

module.exports = router;
