const express = require('express');
const { getGroup, joinGroup } = require('../controllers/groupController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// @route   GET api/groups/:id
// @desc    Get a group
// @access  Private
router.get('/:id', auth, getGroup);

// @route   POST api/groups/:id/join
// @desc    Join a group
// @access  Private
router.post('/:id/join', auth, joinGroup);

module.exports = router;
