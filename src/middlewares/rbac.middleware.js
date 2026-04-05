const ApiError = require('../utils/ApiError');

/**
 * Role-Based Access Control middleware
 * Accepts allowed roles and checks if the authenticated user has one of them
 * 
 * Usage: authorize('admin', 'analyst')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Role '${req.user.role}' is not authorized to perform this action. Required roles: ${allowedRoles.join(', ')}`
        )
      );
    }

    next();
  };
};

module.exports = authorize;
