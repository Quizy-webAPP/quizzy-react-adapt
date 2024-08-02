const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware for protected routes
const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getProfile);

module.exports = router;
