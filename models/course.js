const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  category: { type: String, required: true },
});

module.exports = mongoose.model('Course', CourseSchema);
