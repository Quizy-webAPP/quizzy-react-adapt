const express = require('express');
const { createDepartment, getDepartments, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST api/departments
// @desc    Create a department
// @access  Private
router.post('/', auth, createDepartment);

// @route   GET api/departments
// @desc    Get all departments
// @access  Private
router.get('/', auth, getDepartments);

// @route   PUT api/departments/:id
// @desc    Update a department
// @access  Private
router.put('/:id', auth, updateDepartment);

// @route   DELETE api/departments/:id
// @desc    Delete a department
// @access  Private
router.delete('/:id', auth, deleteDepartment);

module.exports = router;
