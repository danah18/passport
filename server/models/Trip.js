// models/Trip.js

const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    places: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', TripSchema);