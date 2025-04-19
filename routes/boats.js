const express = require('express');
const router = express.Router();
const Boat = require('../models/Boat');

// @route   GET api/boats
// @desc    Get all boats
// @access  Public
router.get('/', async (req, res) => {
  try {
    const boats = await Boat.find();
    res.json(boats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/boats/:id
// @desc    Get boat by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const boat = await Boat.findById(req.params.id);
    if (!boat) {
      return res.status(404).json({ msg: 'Boat not found' });
    }
    res.json(boat);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Boat not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
