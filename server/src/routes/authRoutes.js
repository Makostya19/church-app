const express = require('express');
const router = express.Router();
const { register, login, googleLogin, getMe, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validate = require('../middleware/validate');

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/sns/google', googleLogin);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

module.exports = router;