const express = require('express');
const router = express.Router();
const { getEvents, getEvent, createEvent, updateEvent, updateEventStatus, deleteEvent } = require('../controllers/eventController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { eventValidator } = require('../validators/eventValidator');
const validate = require('../middleware/validate');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', authenticate, requireAdmin, upload.single('image'), eventValidator, validate, createEvent);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), eventValidator, validate, updateEvent);
router.patch('/:id/status', authenticate, requireAdmin, updateEventStatus);
router.delete('/:id', authenticate, requireAdmin, deleteEvent);

module.exports = router;