// tripRoutes.js
const express = require('express');
const router = express.Router();

const Trip = require('../models/Trip');
const Place = require('../models/Place');

// GET all Trips
// TODO: Place population as optional param
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find({}).populate('places');
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET one Trip by ID (populate places)
router.get('/:tripId', async (req, res) => {
    try {
        const { tripId } = req.params;
        const trip = await Trip.findById(tripId).populate('places');
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE a new Trip
router.post('/', async (req, res) => {
    try {
        // Expects body: { name, description, ... }
        const newTrip = await Trip.create(req.body);
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// UPDATE a Trip
router.put('/:tripId', async (req, res) => {
    try {
        const { tripId } = req.params;
        const updatedTrip = await Trip.findByIdAndUpdate(tripId, req.body, {
            new: true, // return the updated document
            runValidators: true,
        });
        if (!updatedTrip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.status(200).json(updatedTrip);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a Trip
router.delete('/:tripId', async (req, res) => {
    try {
        const { tripId } = req.params;
        const deletedTrip = await Trip.findByIdAndDelete(tripId);
        if (!deletedTrip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        // also delete the associated places
        await Place.deleteMany({ _id: { $in: deletedTrip.places } });

        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all Places for a specific Trip
router.get('/:tripId/places', async (req, res) => {
    try {
        const { tripId } = req.params;
        // Make sure the Trip exists
        const trip = await Trip.findById(tripId).populate('places');
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        // Return the Trip's places array
        res.status(200).json(trip.places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET one specific Place for a Trip
router.get('/:tripId/places/:placeId', async (req, res) => {
    try {
        const { tripId, placeId } = req.params;
        // Ensure the Trip exists
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        // Check if the placeId is actually in this trip's places array
        if (!trip.places.includes(placeId)) {
            return res.status(404).json({ error: 'Place not found in this Trip' });
        }
        // Fetch the Place details
        const place = await Place.findById(placeId);
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }
        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE a new Place for a given Trip
router.post('/:tripId/places', async (req, res) => {
    try {
        const { tripId } = req.params;
        const placeData = req.body; // e.g. { name, description, category, address }

        // 1. Verify Trip exists
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // 2. Create a new Place document
        const newPlace = await Place.create(placeData);

        // 3. Push the place's _id into the Trip's places array
        trip.places.push(newPlace._id);
        await trip.save();

        // Return the newly created place
        return res.status(201).json(newPlace);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// UPDATE a Place within a Trip
router.put('/:tripId/places/:placeId', async (req, res) => {
    try {
        const { tripId, placeId } = req.params;

        // Ensure the Trip exists and the place belongs to the Trip
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        if (!trip.places.includes(placeId)) {
            return res.status(404).json({ error: 'Place not found in this Trip' });
        }

        // Update the Place itself
        const updatedPlace = await Place.findByIdAndUpdate(placeId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedPlace) {
            return res.status(404).json({ error: 'Place not found' });
        }

        res.status(200).json(updatedPlace);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a Place from a Trip
router.delete('/:tripId/places/:placeId', async (req, res) => {
    try {
        const { tripId, placeId } = req.params;

        // Check if the Trip exists
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Check if the place is in the Trip's places array
        const placeIndex = trip.places.indexOf(placeId);
        if (placeIndex === -1) {
            return res.status(404).json({ error: 'Place not in this Trip' });
        }

        // Remove the placeId from the trip’s places array
        trip.places.splice(placeIndex, 1);
        await trip.save();
        const deletedPlace = await Place.findByIdAndDelete(placeId);

        res.status(200).json({
            message: 'Place removed from Trip',
            deletedPlace,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;