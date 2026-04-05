/**
 * Application-wide constants
 */
const ROLES = {
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin',
};

const RECORD_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

const CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Food',
  'Rent',
  'Utilities',
  'Transport',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education',
  'Travel',
  'Insurance',
  'Taxes',
  'Savings',
  'Other',
];

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

module.exports = {
  ROLES,
  RECORD_TYPES,
  CATEGORIES,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
