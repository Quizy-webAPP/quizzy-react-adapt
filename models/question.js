const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  year: { type: Number, required: true },
  file: { type: String, required: true } // URL to the document file
});

module.exports = mongoose.model('Question', QuestionSchema);
                                                                                                                                                                                                                                                                                    