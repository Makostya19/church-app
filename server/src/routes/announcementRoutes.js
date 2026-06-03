const express = require('express');
const router = express.Router();
const { getAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, updateAnnouncementStatus, deleteAnnouncement } = require('../controllers/announcementController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);
router.post('/', authenticate, requireAdmin, upload.single('image'), createAnnouncement);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), updateAnnouncement);
router.patch('/:id/status', authenticate, requireAdmin, updateAnnouncementStatus);
router.delete('/:id', authenticate, requireAdmin, deleteAnnouncement);

module.exports = router;