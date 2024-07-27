const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: false }, // URL to thumbnail image
  description: { type: String, required: false }, // Added description field
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

module.exports = mongoose.model('Course', CourseSchema);
