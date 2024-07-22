const Question = require('../models/question');
const multer = require('multer');

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
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

exports.createQuestion = async (req, res) => {
  const { title, year, course } = req.body; // `course` should be an ObjectId

  try {
    const newQuestion = new Question({
      title,
      year,
      course, // Use course ID directly
      filePath: req.file?.path || '', // Ensure filePath is set or empty string
    });

    const question = await newQuestion.save();
    res.status(201).json(question);
  } catch (err) {
    console.error('Error saving question:', err.message);
    res.status(500).send('Server error');
  }
};



exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('course', 'name');
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    res.status(500).send('Server error');
  }
};

exports.updateQuestion = async (req, res) => {
  const { title, year, course } = req.body; // `course` should be an ObjectId

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
    question.course = course || question.course; // Update with course ID

    question = await question.save();
    res.json(question);
  } catch (err) {
    console.error('Error updating question:', err.message);
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
    console.error('Error deleting question:', err.message);
    res.status(500).send('Server error');
  }
};
