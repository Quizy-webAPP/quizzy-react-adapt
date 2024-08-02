const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  school: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Interest', InterestSchema);
