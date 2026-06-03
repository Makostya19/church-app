const express = require('express');
const router = express.Router();
const { getPrayerRequests, createPrayerRequest, updatePrayerRequest, deletePrayerRequest, updateStatus } = require('../controllers/prayerController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', authenticate, getPrayerRequests);
router.post('/', authenticate, createPrayerRequest);
router.put('/:id', authenticate, updatePrayerRequest);
router.delete('/:id', authenticate, deletePrayerRequest);
router.patch('/:id/status', authenticate, requireAdmin, updateStatus);

module.exports = router;