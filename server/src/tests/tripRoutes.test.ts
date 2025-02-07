// tests/tripRoutes.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/User';
import Trip from '../models/Trip';
import Place from '../models/Place';

// import './setup'; // if not using global jest setup

describe('Trip & Place Routes', () => {
    let userId: string;

    beforeEach(async () => {
        // Create a user to own trips
        const user = await User.create({ email: 'tripOwner@example.com' });
        userId = user.id.toString();
    });

    it('POST /api/users/:userId/trips - should create a trip for the user', async () => {
        const res = await request(app)
            .post(`/api/users/${userId}/trips`)
            .send({ name: 'Hawaii Trip', description: 'Beach vacation' });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Hawaii Trip');
        expect(res.body.user).toBe(userId);
    });

    it('GET /api/users/:userId/trips/:tripId - should return 404 if not found', async () => {
        const tripId = new mongoose.Types.ObjectId().toString();
        const res = await request(app).get(`/api/users/${userId}/trips/${tripId}`);
        expect(res.status).toBe(404);
    });

    it('POST /api/users/:userId/trips/:tripId/places - should create a place in a trip', async () => {
        // Create a trip first
        const trip = await Trip.create({ name: 'Europe', user: userId });

        const res = await request(app)
            .post(`/api/users/${userId}/trips/${trip._id}/places`)
            .send({ name: 'Louvre Museum', category: 'museum' });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Louvre Museum');

        // Confirm the trip now has this place
        const updatedTrip = await Trip.findById(trip._id).populate('places');
        expect(updatedTrip?.places.length).toBe(1);
        expect((updatedTrip?.places[0] as any).name).toBe('Louvre Museum');
    });
});
