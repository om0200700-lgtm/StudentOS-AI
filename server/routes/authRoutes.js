const express = require('express');
const { register, login, getMe, forgotPassword, updateProfile } = require('../controllers/authController');
const { googleLogin } = require('../controllers/googleAuthController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);

module.exports = router;
