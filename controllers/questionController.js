const Question = require('../models/question');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}).single('file');

// Create a new question
exports.createQuestion = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: 'File upload error' });
    }
    const { title, year, course } = req.body;

    try {
      const newQuestion = new Question({
        title,
        year,
        course,
        filePath: req.file ? req.file.path : '',
      });

      const question = await newQuestion.save();
      res.status(201).json(question);
    } catch (err) {
      console.error('Error saving question:', err.message);
      res.status(500).send('Server error');
    }
  });
};

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('course', 'name');
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    res.status(500).send('Server error');
  }
};

// Update a question
exports.updateQuestion = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: 'File upload error' });
    }
    const { title, year, course } = req.body;

    try {
      let question = await Question.findById(req.params.id);
      if (!question) {
        return res.status(404).json({ msg: 'Question not found' });
      }

      question.title = title || question.title;
      question.year = year || question.year;
      question.course = course || question.course;
      if (req.file) {
        question.filePath = req.file.path;
      }

      question = await question.save();
      res.json(question);
    } catch (err) {
      console.error('Error updating question:', err.message);
      res.status(500).send('Server error');
    }
  });
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    await question.remove();
    res.json({ msg: 'Question removed' });
  } catch (err) {
    console.error('Error deleting question:', err.message);
    res.status(500).send('Server error');
  }
};

// Serve uploaded files
exports.getFile = (req, res) => {
  const filePath = path.join(__dirname, '../', req.params.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ msg: 'File not found' });
    }
  });
};
