const Course = require('../models/course');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

exports.createCourse = async (req, res) => {
  const { name, department, category, description, levels, code, credit_value } = req.body;
  let thumbnailUrl = null;

  try {
    if (!name || !department || !category || !levels || !code || !credit_value) {
      return res.status(400).json({ msg: 'Name, department, category, levels, code, and credit value are required' });
    }

    // Upload thumbnail to Firebase Storage if provided
    if (req.file) {
      const localFilePath = req.file.path;
      const firebaseStoragePath = `thumbnails/${Date.now()}_${req.file.originalname}`;

      await bucket.upload(localFilePath, {
        destination: firebaseStoragePath,
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Get public URL of the file
      const file = bucket.file(firebaseStoragePath);
      thumbnailUrl = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500', // Set expiration date
      });

      // Clean up the temporary file after upload
      fs.unlinkSync(localFilePath);
    }

    const newCourse = new Course({
      name,
      department,
      category,
      description,
      thumbnail: thumbnailUrl ? thumbnailUrl[0] : null, // Store Firebase URL
      levels,
      code,
      credit_value,
    });

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
  const { name, department, category, description, levels, code, credit_value } = req.body;
  let thumbnailUrl = req.body.thumbnail;

  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Handle thumbnail update if provided
    if (req.file) {
      const localFilePath = req.file.path;
      const firebaseStoragePath = `thumbnails/${Date.now()}_${req.file.originalname}`;

      await bucket.upload(localFilePath, {
        destination: firebaseStoragePath,
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Get public URL of the file
      const file = bucket.file(firebaseStoragePath);
      thumbnailUrl = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      fs.unlinkSync(localFilePath);
    }

    course.name = name || course.name;
    course.department = department || course.department;
    course.category = category || course.category;
    course.description = description || course.description;
    course.thumbnail = thumbnailUrl ? thumbnailUrl[0] : course.thumbnail; // Store Firebase URL
    course.levels = levels || course.levels;
    course.code = code || course.code;
    course.credit_value = credit_value || course.credit_value;

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
