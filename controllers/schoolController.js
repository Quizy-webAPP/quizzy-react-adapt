// controllers/schoolController.js
const School = require('../models/School');

exports.createSchool = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newSchool = new School({ name, description });
    await newSchool.save();
    res.status(201).json(newSchool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.status(200).json(schools);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(200).json(school);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSchool = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedSchool = await School.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!updatedSchool) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(200).json(updatedSchool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSchool = async (req, res) => {
  try {
    const deletedSchool = await School.findByIdAndDelete(req.params.id);
    if (!deletedSchool) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(200).json({ message: 'School deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
