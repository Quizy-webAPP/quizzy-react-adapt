const Department = require('../models/department');

exports.createDepartment = async (req, res) => {
  const { name, school } = req.body;

  try {
    const newDepartment = new Department({ name, school });
    const department = await newDepartment.save();
    res.json(department);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateDepartment = async (req, res) => {
  const { name, school } = req.body;

  try {
    let department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    department.name = name || department.name;
    department.school = school || department.school;

    department = await department.save();
    res.json(department);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    let department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    await department.remove();
    res.json({ msg: 'Department removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
