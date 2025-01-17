// models/Place.js

const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    category: String,
    address: String,
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Place', PlaceSchema);