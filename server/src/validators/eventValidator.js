const { body } = require('express-validator');

const eventValidator = [
  body('title').trim().isLength({ min: 3, max: 150 }).withMessage('Title must be 3-150 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('event_date').notEmpty().isISO8601().withMessage('Valid date is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be positive number'),
];

module.exports = { eventValidator };