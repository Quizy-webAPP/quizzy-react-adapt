// controllers/studentController.js
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register new student
exports.registerStudent = async (req, res) => {
  const { name, email, password, school, department } = req.body;

  try {
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ msg: 'Student already exists' });
    }

    student = new Student({
      name,
      email,
      password,
      school,
      department,
    });

    await student.save();

    const token = generateToken(student._id);

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      school: student.school,
      department: student.department,
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Authenticate student and get token
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(student._id);

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      school: student.school,
      department: student.department,
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Get student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    res.json(student);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
