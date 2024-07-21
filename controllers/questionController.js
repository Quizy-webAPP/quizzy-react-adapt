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

const upload = multer({ storage }).single('file');

exports.createQuestion = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error uploading file');
    }

    const { title, year, course } = req.body;

    try {
      const newQuestion = new Question({
        title,
        year,
        course,
        filePath: req.file.path,
      });
      const question = await newQuestion.save();
      res.json(question);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('course', 'name');
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateQuestion = async (req, res) => {
  const { title, year, course } = req.body;

  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    if (req.file) {
      question.filePath = req.file.path;
    }

    question.title = title || question.title;
    question.year = year || question.year;
    question.course = course || question.course;

    question = await question.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    await question.remove();
    res.json({ msg: 'Question removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
