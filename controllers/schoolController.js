const School = require('../models/School');

exports.createSchool = async (req, res) => {
  const { name } = req.body;

  try {
    const newSchool = new School({ name });
    const school = await newSchool.save();
    res.json(school);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateSchool = async (req, res) => {
  const { name } = req.body;

  try {
    let school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ msg: 'School not found' });
    }

    school.name = name || school.name;

    school = await school.save();
    res.json(school);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteSchool = async (req, res) => {
  try {
    let school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ msg: 'School not found' });
    }

    await school.remove();
    res.json({ msg: 'School removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
