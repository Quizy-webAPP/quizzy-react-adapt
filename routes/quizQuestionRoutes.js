const express = require('express');
const router = express.Router();
const QuizQuestion = require('../models/quizquestion');
const Quiz = require('../models/Quiz');

// POST /api/quizzes/:quizId/questions
router.post('/:quizId/questions', async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questionText, options, points } = req.body;

    if (!questionText || !options || options.length === 0) {
      return res.status(400).json({ error: 'Invalid question data' });
    }

    const newQuestion = new QuizQuestion({
      quizId,
      questionText,
      options,
      points,
    });

    await newQuestion.save();

    // Add question ID to the quiz
    await Quiz.findByIdAndUpdate(quizId, {
      $push: { questionIds: newQuestion._id },
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating question' });
  }
});

// GET /api/quizzes/:quizId/questions
router.get('/:quizId/questions', async (req, res) => {
  try {
    const { quizId } = req.params;

    const questions = await QuizQuestion.find({ quizId }).populate('options');
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

module.exports = router;
