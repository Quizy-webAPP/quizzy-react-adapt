const Course = require('../models/course');

exports.createCourse = async (req, res) => {
  const { name, department, category } = req.body;

  try {
    const newCourse = new Course({ name, department, category });
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('department');
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateCourse = async (req, res) => {
  const { name, department, category } = req.body;

  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    course.name = name || course.name;
    course.department = department || course.department;
    course.category = category || course.category;

    course = await course.save();
    res.json
    (course);
} catch (err) {
  console.error(err.message);
  res.status(500).send('Server error');
}
};

exports.deleteCourse = async (req, res) => {
try {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ msg: 'Course not found' });
  }

  await course.remove();
  res.json({ msg: 'Course removed' });
} catch (err) {
  console.error(err.message);
  res.status(500).send('Server error');
}
};
