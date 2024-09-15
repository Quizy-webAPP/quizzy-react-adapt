const express = require('express');
const { bucket } = require('../firebaseConfig'); // Firebase bucket setup
const multer = require('multer');
const Video = require('../models/Video'); // MongoDB video model
const Course = require('../models/course'); // MongoDB course model
const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory temporarily
});

// POST /api/videos/upload
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { courseId, title } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Check if courseId exists in MongoDB
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Upload the video to Firebase
    const blob = bucket.file(`${Date.now()}_${videoFile.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: videoFile.mimetype, // Set content type
      },
    });

    blobStream.on('error', (err) => {
      return res.status(500).json({ message: 'Error uploading video to Firebase', error: err });
    });

    blobStream.on('finish', async () => {
      // Get the public URL for the uploaded video
      const videoUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;

      // Store the video metadata in MongoDB
      const newVideo = new Video({
        title,
        course: courseId,
        videoUrl,
      });

      await newVideo.save();

      res.status(200).json({ message: 'Video uploaded successfully', videoUrl });
    });

    blobStream.end(videoFile.buffer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
