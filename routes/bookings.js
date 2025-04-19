const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Boat = require('../models/Boat');

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private
router.post(
  '/',
  [
    auth,
    check('boat', 'Boat ID is required').notEmpty(),
    check('startTime', 'Start time is required and should be a valid date').isISO8601(),
    check('endTime', 'End time is required and should be a valid date').isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { boat, startTime, endTime } = req.body;

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ msg: 'End time must be after start time' });
    }

    try {
      // Check if boat exists
      const boatExists = await Boat.findById(boat);
      if (!boatExists) {
        return res.status(404).json({ msg: 'Boat not found' });
      }

      // Check for overlapping bookings
      const overlappingBooking = await Booking.findOne({
        boat,
        $or: [
          { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
          { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
          { startTime: { $lte: new Date(startTime) }, endTime: { $gte: new Date(endTime) } },
        ],
      });

      if (overlappingBooking) {
        return res.status(400).json({ msg: 'Boat is already booked for the selected time period' });
      }

      const booking = new Booking({
        user: req.user.id,
        boat,
        startTime,
        endTime,
      });

      await booking.save();

      res.json(booking);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/bookings
// @desc    Get all bookings of logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('boat');
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/bookings/:id
// @desc    Update a booking (only by owner)
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('startTime', 'Start time should be a valid date').optional().isISO8601(),
    check('endTime', 'End time should be a valid date').optional().isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { startTime, endTime } = req.body;

    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ msg: 'End time must be after start time' });
    }

    try {
      let booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ msg: 'Booking not found' });
      }

      if (booking.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      // Prepare update object
      const updateFields = {};
      if (startTime) updateFields.startTime = startTime;
      if (endTime) updateFields.endTime = endTime;

      // Check for overlapping bookings if dates are updated
      if (startTime || endTime) {
        const newStart = startTime ? new Date(startTime) : booking.startTime;
        const newEnd = endTime ? new Date(endTime) : booking.endTime;

        const overlappingBooking = await Booking.findOne({
          boat: booking.boat,
          _id: { $ne: booking._id },
          $or: [
            { startTime: { $lt: newEnd, $gte: newStart } },
            { endTime: { $gt: newStart, $lte: newEnd } },
            { startTime: { $lte: newStart }, endTime: { $gte: newEnd } },
          ],
        });

        if (overlappingBooking) {
          return res.status(400).json({ msg: 'Boat is already booked for the selected time period' });
        }
      }

      booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true }
      );

      res.json(booking);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/bookings/:id
// @desc    Delete a booking (only by owner)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await booking.remove();

    res.json({ msg: 'Booking removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
