const Course = require('../models/course');

exports.createCourse = async (req, res) => {
  const { name, department, category, description } = req.body;
  const thumbnail = req.file ? req.file.path : null;

  try {
    if (!name || !department || !category) {
      return res.status(400).json({ msg: 'Name, department, and category are required' });
    }

    const newCourse = new Course({ name, department, category, description, thumbnail });
    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
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
  const { name, department, category, description, thumbnail } = req.body;

  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    course.name = name || course.name;
    course.department = department || course.department;
    course.category = category || course.category;
    course.description = description || course.description; // Update description
    course.thumbnail = thumbnail || course.thumbnail;

    course = await course.save();
    res.json(course);
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
