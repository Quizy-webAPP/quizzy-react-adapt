// routes/studentRoutes.js
const express = require('express');
const { registerStudent, loginStudent, getStudentProfile } = require('../controllers/studentController');
const auth = require('../middleware/authMiddlewares');
const router = express.Router();

// @route   POST /api/students/register
// @desc    Register a new student
// @access  Public
router.post('/register', registerStudent);

// @route   POST /api/students/login
// @desc    Authenticate student & get token
// @access  Public
router.post('/login', loginStudent);

// @route   GET /api/students/profile
// @desc    Get student profile
// @access  Private
router.get('/profile', auth, getStudentProfile);

module.exports = router;
