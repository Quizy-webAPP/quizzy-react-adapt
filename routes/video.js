// routes/video.js
const express = require('express');
const { bucket } = require('../firebase');
const multer = require('multer');
const Video = require('../models/Video');
const Course = require('../models/Course');
const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

// POST /api/videos/upload
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { courseId, title } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Upload the video to Firebase
    const blob = bucket.file(videoFile.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: videoFile.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      res.status(500).json({ message: 'Error uploading video to Firebase', error: err });
    });

    blobStream.on('finish', async () => {
      // Construct the public URL to access the video
      const videoUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;

      // Save the video metadata in MongoDB
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
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
