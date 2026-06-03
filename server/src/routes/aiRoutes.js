const express = require('express');
const router = express.Router();
const { generateImage } = require('../controllers/aiController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/images', authenticate, requireAdmin, generateImage);

module.exports = router;