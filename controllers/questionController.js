const Question = require('../models/question');
const Course = require('../models/course');

// Create a question
exports.createQuestion = async (req, res) => {
  const { course, year } = req.body;
  const file = req.file.path; // Assuming file is uploaded and the path is provided

  try {
    const newQuestion = new Question({ course, year, file });
    const question = await newQuestion.save();

    // Add question reference to the course
    const courseDoc = await Course.findById(course);
    courseDoc.questions.push(question._id);
    await courseDoc.save();

    res.status(201).json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all questions for a course
exports.getQuestionsByCourse = async (req, res) => {
  try {
    const questions = await Question.find({ course: req.params.courseId });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  const { course, year, file } = req.body;

  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    question.course = course || question.course;
    question.year = year || question.year;
    question.file = file || question.file;

    question = await question.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
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
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
