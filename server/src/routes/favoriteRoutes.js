const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getFavorites);
router.post('/', authenticate, addFavorite);
router.delete('/', authenticate, removeFavorite);

module.exports = router;