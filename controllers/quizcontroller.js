// controllers/quizController.js

const express = require('express');
const axios = require('axios');
const Quiz = require('../models/Quiz');
const Course = require('../models/course');
const Department = require('../models/department');
const User = require('../models/user');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Helper function to generate quiz via Hugging Face API
const generateQuizWithAI = async (subject, topic, numberOfQuestions, departmentName, courseName) => {
  const prompt = `Create a ${numberOfQuestions}-question multiple-choice quiz on the topic "${topic}" within the subject "${subject}" for the course "${courseName}" in the department "${departmentName}". Provide one correct answer and three plausible distractors for each question. Format the response in JSON with fields: questionText, options, correctAnswer.`;

  const response = await axios.post(
    'https://api-inference.huggingface.co/models/gpt2',
    { inputs: prompt },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const generatedText = response.data[0].generated_text;

  let quizData;
  try {
    quizData = JSON.parse(generatedText);
  } catch (error) {
    throw new Error('Failed to parse AI-generated quiz content.');
  }

  return quizData;
};

// @route   POST /api/quizzes/create
// @desc    Create a quiz manually
// @access  Private (Teachers only)
router.post('/create', authenticate, async (req, res) => {
  try {
    const { courseId, title, questions } = req.body;
    const teacherId = req.user.uid;

    // Validate teacher role
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: Only teachers can create quizzes.' });
    }

    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: 'Invalid course ID.' });
    }

    // Get department from course
    const department = await Department.findById(course.departmentId);
    if (!department) {
      return res.status(400).json({ message: 'Invalid department associated with the course.' });
    }

    // Create new quiz
    const newQuiz = new Quiz({
      courseId: course._id,
      departmentId: department._id,
      title,
      questions, // Array of { questionText, options, correctAnswer }
      createdBy: teacherId,
    });

    await newQuiz.save();

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Server error while creating quiz.' });
  }
});

// @route   POST /api/quizzes/generate
// @desc    Generate a quiz using AI
// @access  Private (Teachers only)
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { courseId, title, numberOfQuestions } = req.body;
    const teacherId = req.user.uid;

    // Validate teacher role
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: Only teachers can generate quizzes.' });
    }

    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: 'Invalid course ID.' });
    }

    // Get department from course
    const department = await Department.findById(course.departmentId);
    if (!department) {
      return res.status(400).json({ message: 'Invalid department associated with the course.' });
    }

    // Generate quiz questions using AI
    const quizData = await generateQuizWithAI(
      course.name,
      title,
      numberOfQuestions || 5,
      department.name,
      course.name
    );

    // Validate quizData
    if (!Array.isArray(quizData) || quizData.length === 0) {
      return res.status(400).json({ message: 'AI did not generate valid quiz data.' });
    }

    // Create new quiz
    const newQuiz = new Quiz({
      courseId: course._id,
      departmentId: department._id,
      title,
      questions: quizData, // Expected to be array of { questionText, options, correctAnswer }
      createdBy: teacherId,
    });

    await newQuiz.save();

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Error generating AI quiz:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Server error while generating AI quiz.' });
  }
});

// @route   GET /api/quizzes/:courseId
// @desc    Get all quizzes for a specific course
// @access  Private (Students and Teachers)
router.get('/:courseId', authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: 'Invalid course ID.' });
    }

    // Get quizzes
    const quizzes = await Quiz.find({ courseId: course._id });

    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error while fetching quizzes.' });
  }
});

// @route   GET /api/quizzes/quiz/:quizId
// @desc    Get quiz details
// @access  Private (Students and Teachers)
router.get('/quiz/:quizId', authenticate, async (req, res) => {
  try {
    const { quizId } = req.params;

    // Get quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json({ message: 'Invalid quiz ID.' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    res.status(500).json({ message: 'Server error while fetching quiz details.' });
  }
});

// @route   POST /api/quizzes/submit/:quizId
// @desc    Submit quiz answers and calculate score
// @access  Private (Students only)
router.post('/submit/:quizId', authenticate, async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // Array of { questionId, selectedOption }

    const userId = req.user.uid;

    // Validate user role
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied: Only students can submit quizzes.' });
    }

    // Get quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json({ message: 'Invalid quiz ID.' });
    }

    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'Invalid answers submitted.' });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index].selectedOption;
      if (userAnswer === question.correctAnswer) {
        score += 1; // 1 point per correct answer
      }
    });

    // Update user points
    user.points += score;
    await user.save();

    res.json({ score, total: quiz.questions.length, points: user.points });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error while submitting quiz.' });
  }
});

// @route   GET /api/quizzes/user/points
// @desc    Get user points
// @access  Private (Students)
router.get('/user/points', authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Validate user role
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied: Only students can view points.' });
    }

    res.json({ points: user.points });
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({ message: 'Server error while fetching user points.' });
  }
});

module.exports = router;