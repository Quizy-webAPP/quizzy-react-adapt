const Interest = require('../models/Interest');

// @route   POST api/interests
// @desc    Create a new interest
// @access  Private
exports.createInterest = async (req, res) => {
  try {
    const { name, school, department } = req.body;

    const newInterest = new Interest({ name, school, department });
    await newInterest.save();

    res.status(201).json(newInterest);
  } catch (error) {
    console.error('Error creating interest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET api/interests
// @desc    Get all interests
// @access  Public
exports.getInterests = async (req, res) => {
  try {
    const interests = await Interest.find();
    res.status(200).json(interests);
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET api/interests/:id
// @desc    Get a single interest by ID
// @access  Public
exports.getInterestById = async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id);

    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    res.status(200).json(interest);
  } catch (error) {
    console.error('Error fetching interest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT api/interests/:id
// @desc    Update an interest
// @access  Private
exports.updateInterest = async (req, res) => {
  try {
    const { name, school, department } = req.body;

    const interest = await Interest.findByIdAndUpdate(
      req.params.id,
      { name, school, department },
      { new: true }
    );

    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    res.status(200).json(interest);
  } catch (error) {
    console.error('Error updating interest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   DELETE api/interests/:id
// @desc    Delete an interest
// @access  Private
exports.deleteInterest = async (req, res) => {
  try {
    const interest = await Interest.findByIdAndDelete(req.params.id);

    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    res.status(200).json({ message: 'Interest deleted successfully' });
  } catch (error) {
    console.error('Error deleting interest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};