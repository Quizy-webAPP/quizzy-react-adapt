// models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: false },
  description: { type: String, required: false },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // Add this field to link videos
});

module.exports = mongoose.model('Course', CourseSchema);
