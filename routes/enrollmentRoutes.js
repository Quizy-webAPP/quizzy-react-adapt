// enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const { enrollInCourse, unenrollFromCourse, checkEnrollmentStatus } = require('../controllers/enrollmentController');

// Enroll in a course
router.post('/enroll', enrollInCourse);

// Unenroll from a course
router.post('/unenroll', unenrollFromCourse);

// Check enrollment status
router.get('/status', checkEnrollmentStatus);

module.exports = router;
