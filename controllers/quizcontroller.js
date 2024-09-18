const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Quiz = require('../models/Quiz');
const Question = require('../models/quizquestion');
const Submission = require('../models/Submission');
const User = require('../models/user');

const router = express.Router();

// POST /api/quizzes (Create a quiz)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, courseId, questions } = req.body;
        const teacherId = req.user.id;  // From JWT

        if (!title || !courseId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ error: 'Missing required fields or invalid data' });
        }

        const quiz = new Quiz({
            title,
            courseId,
            questions,
            teacherId
        });

        await quiz.save();
        res.status(201).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating quiz' });
    }
});

// POST /api/quizzes/:quizId/submit (Submit a quiz)
router.post('/:quizId/submit', authMiddleware, async (req, res) => {
    try {
        const { answers } = req.body;
        const studentId = req.user.id;
        const quizId = req.params.quizId;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Invalid answers format' });
        }

        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

        let totalScore = 0;
        const submissionAnswers = [];

        for (const answer of answers) {
            const question = await Question.findById(answer.questionId);
            if (!question) continue;

            const isCorrect = question.options.some(opt => opt.text === answer.selectedOption && opt.isCorrect);

            submissionAnswers.push({
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                isCorrect
            });

            if (isCorrect) {
                totalScore += question.points;
            }
        }

        const submission = new Submission({
            studentId,
            quizId,
            answers: submissionAnswers,
            score: totalScore
        });

        await submission.save();

        // Update student points
        const student = await User.findById(studentId);
        if (student) {
            student.points += totalScore;
            await student.save();
        }

        res.status(200).json({
            message: 'Quiz submitted successfully',
            score: totalScore,
            correctAnswers: submissionAnswers.filter(ans => ans.isCorrect).length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error submitting quiz' });
    }
});

// GET /api/leaderboard (View leaderboard)
router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await User.find().sort({ points: -1 }).limit(10);
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching leaderboard' });
    }
});

module.exports = router;
