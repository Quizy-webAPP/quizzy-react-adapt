const express = require('express');
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST api/categories
// @desc    Create a category
// @access  Private
router.post('/', auth, createCategory);

// @route   GET api/categories
// @desc    Get all categories
// @access  Private
router.get('/', auth, getCategories);

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private
router.put('/:id', auth, updateCategory);

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', auth, deleteCategory);

module.exports = router;
