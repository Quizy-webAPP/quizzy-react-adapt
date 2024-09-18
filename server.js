const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// Enable CORS
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/schools', require('./routes/schoolRoutes'));
app.use('/api/questions', require('./routes/questionRoutes')); // Questions route
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes')); // New Enrollment routes
app.use('/api/interests', require('./routes/interestRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/videos', require('./routes/video'));
app.use('/api/quizzes', require('./controllers/quizcontroller')); // Quiz route for quizzes and submissions
// Serve static files (for uploaded files)
app.use('/uploads', express.static('uploads'));
app.use('/api/quizzes/:quizId/questions', require('./routes/quizQuestionRoutes')); // Quiz Questions route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
