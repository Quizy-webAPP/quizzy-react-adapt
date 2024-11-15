const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: false },
  description: { type: String, required: false },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  levels: { type: [Number], enum: [200, 300, 400, 601, 602], required: true },
  code: { type: String, required: true },
  credit_value: { type: Number, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add teacher reference
});

module.exports = mongoose.model('Course', CourseSchema);
