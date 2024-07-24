const Dropbox = require('dropbox').Dropbox;
const multer = require('multer');
const Question = require('../models/question');

// Configure multer for in-memory file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}).single('file');

// Initialize Dropbox client with access token from environment variables
const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

// Function to upload file to Dropbox and return the file URL
const uploadToDropbox = async (fileBuffer, fileName) => {
  try {
    // Ensure the file name is not undefined
    if (!fileName) {
      throw new Error('File name is undefined');
    }

    // Check if a file with the same name already exists
    let uniqueFileName = fileName;
    let attempt = 0;
    while (true) {
      try {
        await dbx.filesGetMetadata({ path: '/' + uniqueFileName });
        // If no error is thrown, the file exists; modify the name
        uniqueFileName = `${attempt}_${fileName}`;
        attempt++;
      } catch (err) {
        // If a 409 error occurs, the file does not exist
        if (err.response && err.response.status !== 409) {
          throw err;
        }
        break;
      }
    }

    // Upload the file with the determined unique name
    const response = await dbx.filesUpload({
      path: '/' + uniqueFileName,
      contents: fileBuffer,
    });

    // Create a shared link to make the file publicly accessible
    const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: response.result.path_lower,
    });

    return linkResponse.result.url;
  } catch (error) {
    console.error('Dropbox upload error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
};


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

      // Upload file to Dropbox and get the URL
      const filePath = await uploadToDropbox(file.buffer, file.originalname);

      const newQuestion = new Question({
        title,
        year,
        course,
        filePath, // Store Dropbox URL
      });

      await newQuestion.save();
      res.status(201).json(newQuestion);
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
        // Upload new file to Dropbox and get the URL
        const filePath = await uploadToDropbox(file.buffer, file.originalname);
        question.filePath = filePath; // Update filePath with Dropbox URL
      }

      question.title = title || question.title;
      question.year = year || question.year;
      question.course = course || question.course;

      await question.save();
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
