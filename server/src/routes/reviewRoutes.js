const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview, moderateReview } = require('../controllers/reviewController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', getReviews);
router.post('/', authenticate, createReview);
router.delete('/:id', authenticate, deleteReview);
router.patch('/:id/moderate', authenticate, requireAdmin, moderateReview);

module.exports = router;