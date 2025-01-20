// routes/tripRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');
const Place = require('../models/Place');

/*
  GET all trips for a specific user
  GET /api/users/:userId/trips
  Optional: Pass ?expand=true to populate the "places" array
*/
router.get('/:userId/trips', async (req, res) => {
    try {
        const { userId } = req.params;
        const { expand } = req.query; // e.g. ?expand=true

        // Verify the user exists
        const user = await User.findById(userId).select('_id');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Build a Trip query
        let tripQuery = Trip.find({ user: userId });

        // If ?expand=true, populate the places array
        if (expand === 'true') {
            tripQuery = tripQuery.populate('places');
        }

        // Execute the query
        const trips = await tripQuery;
        res.json(trips);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 
  CREATE a trip for a user
  POST /api/users/:userId/trips
*/
router.post('/:userId/trips', async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, description } = req.body;

        // Ensure the user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!name) {
            return res.status(400).json({ error: 'Trip name is required' });
        }

        // Create the trip
        const newTrip = await Trip.create({ name, description, user: user._id });
        res.status(201).json(newTrip);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/* 
  GET one trip (populated with places)
  GET /api/users/:userId/trips/:tripId
*/
router.get('/:userId/trips/:tripId', async (req, res) => {
    try {
        const { userId, tripId } = req.params;
        const trip = await Trip.findOne({ _id: tripId, user: userId }).populate('places');
        if (!trip) return res.status(404).json({ error: 'Trip not found for this user' });
        res.json(trip);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 
  UPDATE a trip
  PUT /api/users/:userId/trips/:tripId
*/
router.put('/:userId/trips/:tripId', async (req, res) => {
    try {
        const { userId, tripId } = req.params;
        const updates = req.body;

        // Only update if the trip belongs to the user
        const updatedTrip = await Trip.findOneAndUpdate(
            { _id: tripId, user: userId },
            updates,
            { new: true, runValidators: true }
        );
        if (!updatedTrip) {
            return res.status(404).json({ error: 'Trip not found or not yours' });
        }
        res.json(updatedTrip);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/* 
  DELETE a trip
  DELETE /api/users/:userId/trips/:tripId
*/
router.delete('/:userId/trips/:tripId', async (req, res) => {
    try {
        const { userId, tripId } = req.params;
        const deletedTrip = await Trip.findOneAndDelete({ _id: tripId, user: userId });
        if (!deletedTrip) return res.status(404).json({ error: 'Trip not found' });

        // Optionally delete all associated places
        await Place.deleteMany({ _id: { $in: deletedTrip.places } });

        res.json({ message: 'Trip deleted successfully', deletedTrip });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 
  CREATE a Place for a Trip
  POST /api/users/:userId/trips/:tripId/places
*/
router.post('/:userId/trips/:tripId/places', async (req, res) => {
    try {
        const { userId, tripId } = req.params;
        const { name, description, category, address } = req.body;

        // Find trip
        const trip = await Trip.findOne({ _id: tripId, user: userId });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        if (!name) {
            return res.status(400).json({ error: 'Place name is required' });
        }

        // Create place
        const newPlace = await Place.create({ name, description, category, address });

        // Link place to trip
        trip.places.push(newPlace._id);
        await trip.save();

        res.status(201).json(newPlace);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/* 
  GET all Places for a Trip
  GET /api/users/:userId/trips/:tripId/places
*/
router.get('/:userId/trips/:tripId/places', async (req, res) => {
    try {
        const { userId, tripId } = req.params;
        const trip = await Trip.findOne({ _id: tripId, user: userId }).populate('places');
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        res.json(trip.places);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 
  GET a specific Place in a Trip
  GET /api/users/:userId/trips/:tripId/places/:placeId
*/
router.get('/:userId/trips/:tripId/places/:placeId', async (req, res) => {
    try {
        const { userId, tripId, placeId } = req.params;

        // Verify trip belongs to user
        const trip = await Trip.findOne({ _id: tripId, user: userId });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        // Check if place belongs to trip
        if (!trip.places.includes(placeId)) {
            return res.status(404).json({ error: 'Place not found in this trip' });
        }

        const place = await Place.findById(placeId);
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }
        res.json(place);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 
  UPDATE a Place
  PUT /api/users/:userId/trips/:tripId/places/:placeId
*/
router.put('/:userId/trips/:tripId/places/:placeId', async (req, res) => {
    try {
        const { userId, tripId, placeId } = req.params;

        // Verify trip
        const trip = await Trip.findOne({ _id: tripId, user: userId });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        if (!trip.places.includes(placeId)) {
            return res.status(404).json({ error: 'Place not found in this trip' });
        }

        const updatedPlace = await Place.findByIdAndUpdate(placeId, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedPlace) return res.status(404).json({ error: 'Place not found' });
        res.json(updatedPlace);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/* 
  DELETE a Place
  DELETE /api/users/:userId/trips/:tripId/places/:placeId
*/
router.delete('/:userId/trips/:tripId/places/:placeId', async (req, res) => {
    try {
        const { userId, tripId, placeId } = req.params;

        const trip = await Trip.findOne({ _id: tripId, user: userId });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        const index = trip.places.indexOf(placeId);
        if (index === -1) {
            return res.status(404).json({ error: 'Place not found in this trip' });
        }

        // Remove from the array
        trip.places.splice(index, 1);
        await trip.save();

        // Optionally delete the Place document itself
        const deletedPlace = await Place.findByIdAndDelete(placeId);

        res.json({ message: 'Place removed from Trip', deletedPlace });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
