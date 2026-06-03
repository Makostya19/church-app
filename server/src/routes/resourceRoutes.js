const express = require('express');
const router = express.Router();
const { getResources, getResource, createResource, updateResource, updateResourceStatus, deleteResource } = require('../controllers/resourceController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', getResources);
router.get('/:id', getResource);
router.post('/', authenticate, requireAdmin, createResource);
router.put('/:id', authenticate, requireAdmin, updateResource);
router.patch('/:id/status', authenticate, requireAdmin, updateResourceStatus);
router.delete('/:id', authenticate, requireAdmin, deleteResource);

module.exports = router;