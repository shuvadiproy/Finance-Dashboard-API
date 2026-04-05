const { body, param, query } = require('express-validator');
const { RECORD_TYPES, CATEGORIES } = require('../utils/constants');

const createRecordValidator = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),

  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(Object.values(RECORD_TYPES))
    .withMessage('Type must be either income or expense'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

const updateRecordValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid record ID format'),

  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),

  body('type')
    .optional()
    .isIn(Object.values(RECORD_TYPES))
    .withMessage('Type must be either income or expense'),

  body('category')
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

const recordIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid record ID format'),
];

module.exports = {
  createRecordValidator,
  updateRecordValidator,
  recordIdValidator,
};
