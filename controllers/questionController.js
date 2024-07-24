const cloudinary = require('../config/cloudinary'); // Import your Cloudinary configuration
const Question = require('../models/question');
const streamifier = require('streamifier');
const multer = require('multer');

// Configure multer for in-memory file uploads
const storage = multer.memoryStorage(); // Use memory storage for Cloudinary
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}).single('file');

// Create a new question
exports.createQuestion = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: 'File upload error' });
    }

    try {
      // Upload file to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream();
      const bufferStream = streamifier.createReadStream(req.file.buffer);

      bufferStream.pipe(uploadStream);

      uploadStream.on('finish', async () => {
        const { title, year, course } = req.body;

        const newQuestion = new Question({
          title,
          year,
          course,
          filePath: uploadStream.url, // Store Cloudinary URL
        });

        const question = await newQuestion.save();
        res.status(201).json(question);
      });

      uploadStream.on('error', (uploadErr) => {
        console.error('Cloudinary upload error:', uploadErr.message);
        res.status(500).send('Server error');
      });
    } catch (err) {
      console.error('Error saving question:', err.message);
      res.status(500).send('Server error');
    }
  });
};

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('course', 'name');
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    res.status(500).send('Server error');
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: 'File upload error' });
    }

    try {
      let question = await Question.findById(req.params.id);
      if (!question) {
        return res.status(404).json({ msg: 'Question not found' });
      }

      const { title, year, course } = req.body;

      if (req.file) {
        // Upload new file to Cloudinary and get the URL
        const uploadStream = cloudinary.uploader.upload_stream();
        const bufferStream = streamifier.createReadStream(req.file.buffer);

        bufferStream.pipe(uploadStream);

        uploadStream.on('finish', async () => {
          question.filePath = uploadStream.url; // Update filePath with Cloudinary URL
        });

        uploadStream.on('error', (uploadErr) => {
          console.error('Cloudinary upload error:', uploadErr.message);
          res.status(500).send('Server error');
        });
      }

      question.title = title || question.title;
      question.year = year || question.year;
      question.course = course || question.course;

      question = await question.save();
      res.json(question);
    } catch (err) {
      console.error('Error updating question:', err.message);
      res.status(500).send('Server error');
    }
  });
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    await question.remove();
    res.json({ msg: 'Question removed' });
  } catch (err) {
    console.error('Error deleting question:', err.message);
    res.status(500).send('Server error');
  }
};
