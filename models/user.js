const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'student' },
  rank: { type: Number, default: 0 },
  points: { type: Number, default: 0 }, // Points for students
  school: {
    type: String,
    default: '',
  },
  department: {
    type: String,
    default: '',
  },
  interests: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('User', UserSchema);
