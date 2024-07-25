// controllers/studentController.js
const Student = require('../models/student');

exports.createStudent = async (req, res) => {
  const { name, email, school, department } = req.body;

  try {
    const newStudent = new Student({ name, email, school, department });
    const student = await newStudent.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('school').populate('department');
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateStudent = async (req, res) => {
  const { name, email, school, department } = req.body;

  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.school = school || student.school;
    student.department = department || student.department;

    student = await student.save();
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    await student.remove();
    res.json({ msg: 'Student removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
