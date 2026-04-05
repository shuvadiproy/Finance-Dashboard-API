const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Validation middleware
 * Runs after express-validator checks and returns formatted errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return ApiResponse.error(res, {
      statusCode: 422,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = validate;
