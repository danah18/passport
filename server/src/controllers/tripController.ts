// src/controllers/tripController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import Trip from '../models/Trip';
import Place from '../models/Place';
import { asyncHandler } from '../middleware/asyncHandler';

/**
 * Controller for handling trip-related operations.
 */
export class TripController {
    /**
     * Creates a new trip for a user.
     * @route POST /api/users/:userId/trips
     * @returns 201 Created - The newly created trip.
     * @returns 400 Bad Request - If the trip name is missing.
     * @returns 404 Not Found - If the user does not exist.
     */
    public createTrip = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { name, description } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Trip name is required' });
        }

        const newTrip = await Trip.create({ name, description, user: user._id, places: [] });

        res.status(201).json(newTrip);
    });

    /**
     * Retrieves a trip by ID for a specific user.
     * @route GET /api/users/:userId/trips/:tripId
     * @returns 200 OK - The requested trip.
     * @returns 404 Not Found - If the trip does not exist for this user.
     */
    public getTripById = asyncHandler(async (req: Request, res: Response) => {
        const { userId, tripId } = req.params;
        const trip = await Trip.findOne({ _id: tripId, user: userId }).populate('places');

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found for this user' });
        }

        res.json(trip);
    });

    /**
     * Creates a place under a trip.
     * @route POST /api/users/:userId/trips/:tripId/places
     * @returns 201 Created - The newly created place.
     * @returns 400 Bad Request - If the place name is missing.
     * @returns 404 Not Found - If the trip does not exist.
     */
    public createPlace = asyncHandler(async (req: Request, res: Response) => {
        const { userId, tripId } = req.params;
        const { name, description, category, address } = req.body;

        const trip = await Trip.findOne({ _id: tripId, user: userId });
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Place name is required' });
        }

        const newPlace = await Place.create({ name, description, category, address });
        trip.places.push(newPlace.id);
        await trip.save();

        res.status(201).json(newPlace);
    });

    /**
     * Retrieves all places for a trip.
     * @route GET /api/users/:userId/trips/:tripId/places
     * @returns 200 OK - A list of places under the trip.
     * @returns 404 Not Found - If the trip does not exist.
     */
    public getTripPlaces = asyncHandler(async (req: Request, res: Response) => {
        const { userId, tripId } = req.params;
        const trip = await Trip.findOne({ _id: tripId, user: userId }).populate('places');

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.json(trip.places);
    });
}

export const tripController = new TripController();
