const express = require('express');
const { createSchool, getSchools, updateSchool, deleteSchool } = require('../controllers/schoolController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST api/schools
// @desc    Create a school
// @access  Private
router.post('/', auth, createSchool);

// @route   GET api/schools
// @desc    Get all schools
// @access  Private
router.get('/', auth, getSchools);

// @route   PUT api/schools/:id
// @desc    Update a school
// @access  Private
router.put('/:id', auth, updateSchool);

// @route   DELETE api/schools/:id
// @desc    Delete a school
// @access  Private
router.delete('/:id', auth, deleteSchool);

module.exports = router;
