const express = require('express');
const { createCourse, getCourses, updateCourse, deleteCourse } = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST api/courses
// @desc    Create a course
// @access  Private
router.post('/', auth, createCourse);

// @route   GET api/courses
// @desc    Get all courses
// @access  Private
router.get('/', auth, getCourses);

// @route   PUT api/courses/:id
// @desc    Update a course
// @access  Private
router.put('/:id', auth, updateCourse);

// @route   DELETE api/courses/:id
// @desc    Delete a course
// @access  Private
router.delete('/:id', auth, deleteCourse);

module.exports = router;
