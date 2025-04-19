const mongoose = require('mongoose');

const BoatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Boat', BoatSchema);
