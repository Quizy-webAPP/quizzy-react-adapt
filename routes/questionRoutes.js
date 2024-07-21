const express = require('express');
const { createQuestion, getQuestions, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// @route   POST api/questions
// @desc    Create a question
// @access  Private
router.post('/', auth, upload.single('file'), createQuestion);

// @route   GET api/questions
// @desc    Get all questions
// @access  Private
router.get('/', auth, getQuestions);


// @route   PUT api/questions/:id
// @desc    Update a question
// @access  Private
router.put('/:id', auth, upload.single('file'), updateQuestion);

// @route   DELETE api/questions/:id
// @desc    Delete a question
// @access  Private
router.delete('/:id', auth, deleteQuestion);

module.exports = router;
