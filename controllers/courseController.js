// controllers/courseController.js
const Course = require('../models/course');
const { bucket } = require('../firebaseConfig'); // Adjust the path based on your project structure
const path = require('path');
const fs = require('fs');

exports.createCourse = async (req, res) => {
  const { name, department, category, description, levels, code, credit_value, teacher } = req.body;
  let thumbnailUrl = null;

  try {
    // Validate required fields
    if (!name || !department || !category || !levels || !code || !teacher || credit_value === undefined) {
      return res.status(400).json({ msg: 'Name, department, category, levels, code, and credit value, and teacher are required' });
    }

    // Additional validation for teacher if necessary
    const teacherExists = await User.findById(teacher);
    if (!teacherExists) {
      return res.status(404).json({ msg: 'Teacher not found' });
    }

    // Parse credit_value as Number
    const parsedCreditValue = Number(credit_value);
    if (isNaN(parsedCreditValue)) {
      return res.status(400).json({ msg: 'Credit value must be a number' });
    }

    // Upload thumbnail to Firebase Storage if provided
    if (req.file) {
      const localFilePath = req.file.path;
      const firebaseStoragePath = `thumbnails/${Date.now()}_${path.basename(req.file.originalname)}`;
      const file = bucket.file(firebaseStoragePath);

      await bucket.upload(localFilePath, {
        destination: firebaseStoragePath,
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Get a signed URL (Preferred for security)
      thumbnailUrl = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500', // Adjust as needed
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
      levels: typeof levels === 'string' ? levels.split(',').map(Number) : levels, // Handle both string and array inputs
      code,
      credit_value: parsedCreditValue,
      teacher,
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
    const courses = await Course.find()
    .populate('department')
    .populate('teacher', 'name thumbnail');
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateCourse = async (req, res) => {
  const { name, department, category, description, levels, code, credit_value } = req.body;
  let thumbnailUrl = req.body.thumbnail; // Existing thumbnail URL

  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Handle thumbnail update if provided
    if (req.file) {
      // Delete the old thumbnail from Firebase if it exists
      if (course.thumbnail) {
        try {
          const url = new URL(course.thumbnail);
          const oldFilePath = url.pathname.startsWith('/')
            ? url.pathname.substring(1)
            : url.pathname; // Remove leading '/' if present

          const oldFile = bucket.file(oldFilePath);
          await oldFile.delete();
        } catch (error) {
          console.error('Failed to delete old thumbnail:', error.message);
          // Optionally, you can choose to proceed or return an error here
        }
      }

      const localFilePath = req.file.path;
      const firebaseStoragePath = `thumbnails/${Date.now()}_${path.basename(req.file.originalname)}`;
      const file = bucket.file(firebaseStoragePath);

      await bucket.upload(localFilePath, {
        destination: firebaseStoragePath,
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Get a signed URL
      thumbnailUrl = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      // Clean up the temporary file after upload
      fs.unlinkSync(localFilePath);
    }

    // Parse credit_value as Number if provided
    let parsedCreditValue = course.credit_value;
    if (credit_value !== undefined) {
      parsedCreditValue = Number(credit_value);
      if (isNaN(parsedCreditValue)) {
        return res.status(400).json({ msg: 'Credit value must be a number' });
      }
    }

    // Update course fields
    course.name = name || course.name;
    course.department = department || course.department;
    course.category = category || course.category;
    course.description = description || course.description;
    course.thumbnail = thumbnailUrl ? thumbnailUrl[0] : course.thumbnail; // Store Firebase URL
    course.levels = levels ? (typeof levels === 'string' ? levels.split(',').map(Number) : levels) : course.levels;
    course.code = code || course.code;
    course.credit_value = parsedCreditValue;

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

    // Delete the thumbnail from Firebase if it exists
    if (course.thumbnail) {
      try {
        const url = new URL(course.thumbnail);
        const filePath = url.pathname.startsWith('/')
          ? url.pathname.substring(1)
          : url.pathname; // Remove leading '/' if present

        const file = bucket.file(filePath);
        await file.delete();
      } catch (error) {
        console.error('Failed to delete thumbnail:', error.message);
        // Optionally, you can choose to proceed or return an error here
      }
    }

    await course.remove();
    res.json({ msg: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
