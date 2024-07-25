// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { createStudent, getStudents, updateStudent, deleteStudent } = require('../controllers/studentController');

// @route   POST /api/students
// @desc    Create a student
// @access  Public
router.post('/', createStudent);

// @route   GET /api/students
// @desc    Get all students
// @access  Public
router.get('/', getStudents);

// @route   PUT /api/students/:id
// @desc    Update a student
// @access  Public
router.put('/:id', updateStudent);

// @route   DELETE /api/students/:id
// @desc    Delete a student
// @access  Public
router.delete('/:id', deleteStudent);

module.exports = router;
