const express = require('express');
const {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  getFile,
} = require('../controllers/questionController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST api/questions
// @desc    Create a question
// @access  Private
router.post('/', auth, createQuestion);

// @route   GET api/questions
// @desc    Get all questions
// @access  Private
router.get('/', auth, getQuestions);

// @route   PUT api/questions/:id
// @desc    Update a question
// @access  Private
router.put('/:id', auth, updateQuestion);

// @route   DELETE api/questions/:id
// @desc    Delete a question
// @access  Private
router.delete('/:id', auth, deleteQuestion);

// @route   GET /uploads/:filename
// @desc    Serve uploaded files
// @access  Private (or Public based on your requirement)
router.get('/uploads/:filename', getFile);

module.exports = router;
