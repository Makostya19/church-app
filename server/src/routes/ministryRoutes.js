const express = require('express');
const router = express.Router();
const { getMinistries, getMinistry, createMinistry, updateMinistry, deleteMinistry } = require('../controllers/ministryController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', getMinistries);
router.get('/:id', getMinistry);
router.post('/', authenticate, requireAdmin, createMinistry);
router.put('/:id', authenticate, requireAdmin, updateMinistry);
router.delete('/:id', authenticate, requireAdmin, deleteMinistry);

module.exports = router;