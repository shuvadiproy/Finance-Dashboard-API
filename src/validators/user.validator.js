const { body, param } = require('express-validator');
const { ROLES } = require('../utils/constants');

const updateUserValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
];

const updateStatusValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  body('isActive')
    .notEmpty()
    .withMessage('isActive is required')
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

const userIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format'),
];

module.exports = {
  updateUserValidator,
  updateStatusValidator,
  userIdValidator,
};
