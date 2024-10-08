const { bucket } = require('../firebaseConfig'); // Adjust the path based on your project structure

const multer = require('multer');
const Question = require('../models/question');

// // Initialize Firebase Admin SDK
// const serviceAccount = require('../school-management-e7a71-firebase-adminsdk-8dn9n-dbc0b4ca7b.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'gs://school-management-e7a71.appspot.com' // Replace with your Firebase Storage bucket URL
// });

// const bucket = admin.storage().bucket();

// Configure multer for in-memory file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}).single('file');

const uploadToFirebase = async (fileBuffer, fileName) => {
  try {
    const file = bucket.file(fileName);
    await file.save(fileBuffer, {
      metadata: { contentType: 'application/octet-stream' },
    });
    const [url] = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' });
    return url;
  } catch (error) {
    console.error('Firebase upload error:', error.message);
    throw error;
  }
};

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

      const filePath = await uploadToFirebase(file.buffer, file.originalname);

      const newQuestion = new Question({
        title,
        year,
        course,
        filePath, // Store Firebase URL
      });

      await newQuestion.save();
      res.status(201).json(newQuestion);
    } catch (err) {
      console.error('Error processing file:', err.message);
      res.status(500).send('Server error');
    }
  });
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('course', 'name');
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    res.status(500).send('Server error');
  }
};

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
        const filePath = await uploadToFirebase(file.buffer, file.originalname);
        question.filePath = filePath; // Update filePath with Firebase URL
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
