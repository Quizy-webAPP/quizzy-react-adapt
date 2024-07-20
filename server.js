const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

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
app.use('/api/schools', require('./routes/schoolRoutes')); // Ensure you require schoolRoutes here

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
