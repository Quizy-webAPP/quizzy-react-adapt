const mongoose = require('mongoose');

const QuizQuestionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  questionText: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
  }],
  points: { type: Number, default: 1 }
});

module.exports = mongoose.model('QuizQuestion', QuizQuestionSchema);
