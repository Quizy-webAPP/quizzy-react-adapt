const express = require('express');
const { register, login,login_main, getProfile, updateUserProfile, selectSchool, selectDepartment, selectInterests } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

router.post('/login_main', login_main);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getProfile);

// @route   PUT api/auth/updateProfile
// @desc    Update user profile
// @access  Private
router.put('/updateProfile', auth, updateUserProfile);

// @route   PUT api/auth/selectSchool
// @desc    Select school for user
// @access  Private
router.put('/selectSchool', auth, selectSchool);

// @route   PUT api/auth/selectDepartment
// @desc    Select department for user
// @access  Private
router.put('/selectDepartment', auth, selectDepartment);

// @route   PUT api/auth/selectInterests
// @desc    Select interests for user
// @access  Private
router.put('/selectInterests', auth, selectInterests);

module.exports = router;
