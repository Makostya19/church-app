const { body } = require('express-validator');

const reviewValidator = [
  body('targetType').isIn(['event', 'announcement', 'resource']).withMessage('Invalid target type'),
  body('targetId').isInt({ min: 1 }).withMessage('Invalid target ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment max 1000 characters'),
];

module.exports = { reviewValidator };