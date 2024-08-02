const express = require('express');
const { createInterest, getInterests, getInterestById, updateInterest, deleteInterest } = require('../controllers/interestController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST api/interests
// @desc    Create a new interest
// @access  Private
router.post('/', auth, createInterest);

// @route   GET api/interests
// @desc    Get all interests
// @access  Public
router.get('/', getInterests);

// @route   GET api/interests/:id
// @desc    Get an interest by ID
// @access  Public
router.get('/:id', getInterestById);

// @route   PUT api/interests/:id
// @desc    Update an interest
// @access  Private
router.put('/:id', auth, updateInterest);

// @route   DELETE api/interests/:id
// @desc    Delete an interest
// @access  Private
router.delete('/:id', auth, deleteInterest);

module.exports = router;
