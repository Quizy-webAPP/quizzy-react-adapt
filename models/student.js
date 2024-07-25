// models/student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
});

module.exports = mongoose.model('Student', StudentSchema);
