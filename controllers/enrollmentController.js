const Course = require('../models/course');
const Student = require('../models/Student');
const Enrollment = require('../models/enrollment'); // Ensure this path is correct

// Check if a student is enrolled in a specific course
const checkEnrollmentStatus = async (req, res) => {
    try {
        const { courseId } = req.query;
        const userId = req.user._id; // Assuming user ID is available in `req.user`

        if (!courseId) {
            return res.status(400).json({ message: 'Course ID is required' });
        }

        const enrollment = await Enrollment.findOne({ course: courseId, student: userId });

        if (enrollment) {
            return res.status(200).json({ isEnrolled: true });
        } else {
            return res.status(200).json({ isEnrolled: false });
        }
    } catch (error) {
        console.error('Failed to check enrollment status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const enrollInCourse = async (req, res) => {
  const { courseId, studentId } = req.body;

  try {
    // Find the course and student
    const course = await Course.findById(courseId);
    const student = await Student.findById(studentId);

    if (!course || !student) {
      return res.status(404).json({ success: false, message: 'Course or student not found' });
    }

    // Check if the student is already enrolled
    if (course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ success: false, message: 'Student already enrolled' });
    }

    // Enroll the student
    course.enrolledStudents.push(studentId);
    await course.save();

    // Increment the number of enrolled students
    course.enrolledCount += 1;
    await course.save();

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const unenrollFromCourse = async (req, res) => {
  const { courseId, studentId } = req.body;

  try {
    // Find the course and student
    const course = await Course.findById(courseId);
    const student = await Student.findById(studentId);

    if (!course || !student) {
      return res.status(404).json({ success: false, message: 'Course or student not found' });
    }

    // Check if the student is enrolled
    if (!course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ success: false, message: 'Student not enrolled' });
    }

    // Unenroll the student
    course.enrolledStudents = course.enrolledStudents.filter(id => id !== studentId);
    await course.save();

    // Decrement the number of enrolled students
    course.enrolledCount -= 1;
    await course.save();

    res.json({ success: true, message: 'Unenrolled successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { enrollInCourse, checkEnrollmentStatus, unenrollFromCourse };

