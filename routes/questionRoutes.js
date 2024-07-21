const express = require('express');
const { createQuestion, getQuestionsByCourse, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// @route   POST api/questions
// @desc    Create a question
// @access  Private
router.post('/', [auth, upload.single('file')], createQuestion);

// @route   GET api/questions/course/:courseId
// @desc    Get all questions for a course
// @access  Private
router.get('/course/:courseId', auth, getQuestionsByCourse);

// @route   PUT api/questions/:id
// @desc    Update a question
// @access  Private
router.put('/:id', auth, updateQuestion);

// @route   DELETE api/questions/:id
// @desc    Delete a question
// @access  Private
router.delete('/:id', auth, deleteQuestion);

module.exports = router;
