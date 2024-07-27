const express = require('express');
const router = express.Router();
const { enrollInCourse, unenrollFromCourse } = require('../controllers/enrollmentController');

// Enroll in a course
router.post('/enroll', enrollInCourse);

// Unenroll from a course
router.post('/unenroll', unenrollFromCourse);

module.exports = router;
