const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: false },
  description: { type: String, required: false },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // Add this field to link videos
  levels: { type: [Number], enum: [200, 300, 400, 601, 602], required: true }, // Add levels
  code: { type: String, required: true }, // Add course code
  credit_value: { type: Number, required: true } // Add credit value
});

module.exports = mongoose.model('Course', CourseSchema);
