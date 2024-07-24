const cloudinary = require('../config/cloudinary'); // Import your Cloudinary configuration
const Question = require('../models/question');
const streamifier = require('streamifier');
const multer = require('multer');

// Configure multer for in-memory file uploads
const storage = multer.memoryStorage();
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
      const { title, year, course } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ msg: 'File is required' });
      }

      // Upload file to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error.message);
          return res.status(500).send('Server error');
        }

        const newQuestion = new Question({
          title,
          year,
          course,
          filePath: result.secure_url, // Store Cloudinary URL
        });

        newQuestion.save()
          .then(question => res.status(201).json(question))
          .catch(err => {
            console.error('Error saving question:', err.message);
            res.status(500).send('Server error');
          });
      });

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    } catch (err) {
      console.error('Error processing file:', err.message);
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
      const file = req.file;

      if (file) {
        // Upload new file to Cloudinary and get the URL
        const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error.message);
            return res.status(500).send('Server error');
          }

          question.filePath = result.secure_url; // Update filePath with Cloudinary URL

          updateAndSaveQuestion();
        });

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } else {
        updateAndSaveQuestion();
      }

      function updateAndSaveQuestion() {
        question.title = title || question.title;
        question.year = year || question.year;
        question.course = course || question.course;

        question.save()
          .then(updatedQuestion => res.json(updatedQuestion))
          .catch(err => {
            console.error('Error updating question:', err.message);
            res.status(500).send('Server error');
          });
      }
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
