// tests/tripRoutes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Place = require('../models/Place');

describe('TRIP & PLACE Routes', () => {
    describe('Trip Routes', () => {
        describe('POST /api/users/:userId/trips', () => {
            it('creates a new trip for a valid user', async () => {
                const user = await User.create({ email: 'tripowner@example.com' });

                const res = await request(app)
                    .post(`/api/users/${user._id}/trips`)
                    .send({ name: 'Thailand', description: 'Amazing beaches' })
                    .expect(201);

                expect(res.body).toHaveProperty('_id');
                expect(res.body.name).toBe('Thailand');
                expect(res.body.user).toBe(user._id.toString());
            });

            it('returns 404 if user not found', async () => {
                const fakeUserId = new mongoose.Types.ObjectId();
                const res = await request(app)
                    .post(`/api/users/${fakeUserId}/trips`)
                    .send({ name: 'Ghost Trip' })
                    .expect(404);

                expect(res.body.error).toBe('User not found');
            });
        });

        describe('GET /api/users/:userId/trips/:tripId', () => {
            it('gets a specific trip if it belongs to the user', async () => {
                const user = await User.create({ email: 'tripgetter@example.com' });
                const trip = await Trip.create({ name: 'Japan Trip', user: user._id });

                const res = await request(app)
                    .get(`/api/users/${user._id}/trips/${trip._id}`)
                    .expect(200);

                expect(res.body._id).toBe(trip._id.toString());
                expect(res.body.name).toBe('Japan Trip');
            });

            it('returns 404 if trip is not found or not owned by user', async () => {
                const user1 = await User.create({ email: 'user1@example.com' });
                const user2 = await User.create({ email: 'user2@example.com' });
                const tripForUser1 = await Trip.create({ name: 'User1 Trip', user: user1._id });

                // Attempt to get user1's trip using user2's ID
                const res = await request(app)
                    .get(`/api/users/${user2._id}/trips/${tripForUser1._id}`)
                    .expect(404);

                expect(res.body.error).toBeDefined();
            });
        });

        describe('PUT /api/users/:userId/trips/:tripId', () => {
            it('updates a trip if it belongs to user', async () => {
                const user = await User.create({ email: 'updatetrip@example.com' });
                const trip = await Trip.create({ name: 'Old Name', user: user._id });

                const res = await request(app)
                    .put(`/api/users/${user._id}/trips/${trip._id}`)
                    .send({ name: 'New Name' })
                    .expect(200);

                expect(res.body.name).toBe('New Name');
            });
        });

        describe('DELETE /api/users/:userId/trips/:tripId', () => {
            it('deletes a trip if it belongs to user', async () => {
                const user = await User.create({ email: 'deltrip@example.com' });
                const trip = await Trip.create({ name: 'Remove Me', user: user._id });

                const res = await request(app)
                    .delete(`/api/users/${user._id}/trips/${trip._id}`)
                    .expect(200);

                expect(res.body.message).toBe('Trip deleted successfully');
                // Confirm trip is removed
                const found = await Trip.findById(trip._id);
                expect(found).toBeNull();
            });
        });
    });

    describe('Place Routes', () => {
        describe('POST /api/users/:userId/trips/:tripId/places', () => {
            it('creates a place for a trip belonging to the user', async () => {
                const user = await User.create({ email: 'placeowner@example.com' });
                const trip = await Trip.create({ name: 'Food Trip', user: user._id });

                const res = await request(app)
                    .post(`/api/users/${user._id}/trips/${trip._id}/places`)
                    .send({ name: 'Best Pizza', description: 'Thin crust in Rome' })
                    .expect(201);

                expect(res.body).toHaveProperty('_id');
                expect(res.body.name).toBe('Best Pizza');

                // Confirm the trip references this place now
                const updatedTrip = await Trip.findById(trip._id).populate('places');
                expect(updatedTrip.places.length).toBe(1);
                expect(updatedTrip.places[0].name).toBe('Best Pizza');
            });

            it('returns 400 if place name is missing', async () => {
                const user = await User.create({ email: 'noname@example.com' });
                const trip = await Trip.create({ name: 'NoNameTrip', user: user._id });

                const res = await request(app)
                    .post(`/api/users/${user._id}/trips/${trip._id}/places`)
                    .send({}) // no name
                    .expect(400);

                expect(res.body.error).toBeDefined();
            });
        });

        describe('GET /api/users/:userId/trips/:tripId/places', () => {
            it('returns all places for a trip', async () => {
                const user = await User.create({ email: 'placeslist@example.com' });
                const trip = await Trip.create({ name: 'City Trip', user: user._id });
                const place1 = await Place.create({ name: 'Museum' });
                const place2 = await Place.create({ name: 'Cafe' });

                trip.places.push(place1._id, place2._id);
                await trip.save();

                const res = await request(app)
                    .get(`/api/users/${user._id}/trips/${trip._id}/places`)
                    .expect(200);

                expect(res.body.length).toBe(2);
                expect(res.body[0].name).toBe('Museum');
                expect(res.body[1].name).toBe('Cafe');
            });
        });

        describe('GET /api/users/:userId/trips/:tripId/places/:placeId', () => {
            it('gets a specific place if it belongs to the trip and user', async () => {
                const user = await User.create({ email: 'onespot@example.com' });
                const trip = await Trip.create({ name: 'OneSpotTrip', user: user._id });
                const place = await Place.create({ name: 'Famous Restaurant' });

                trip.places.push(place._id);
                await trip.save();

                const res = await request(app)
                    .get(`/api/users/${user._id}/trips/${trip._id}/places/${place._id}`)
                    .expect(200);

                expect(res.body.name).toBe('Famous Restaurant');
            });
        });

        describe('PUT /api/users/:userId/trips/:tripId/places/:placeId', () => {
            it('updates a place if it belongs to the trip and user', async () => {
                const user = await User.create({ email: 'updateplace@example.com' });
                const trip = await Trip.create({ name: 'ModifyTrip', user: user._id });
                const place = await Place.create({ name: 'Old Place' });

                trip.places.push(place._id);
                await trip.save();

                const res = await request(app)
                    .put(`/api/users/${user._id}/trips/${trip._id}/places/${place._id}`)
                    .send({ name: 'New Place' })
                    .expect(200);

                expect(res.body.name).toBe('New Place');
            });

            it('returns 404 if place does not belong to the trip or trip does not belong to user', async () => {
                const user1 = await User.create({ email: 'placeUser1@example.com' });
                const user2 = await User.create({ email: 'placeUser2@example.com' });
                const tripUser1 = await Trip.create({ name: 'User1Trip', user: user1._id });
                const place = await Place.create({ name: 'ShouldBelongToUser1' });

                // Link place to user1's trip
                tripUser1.places.push(place._id);
                await tripUser1.save();

                // Attempt to update it as user2
                const res = await request(app)
                    .put(`/api/users/${user2._id}/trips/${tripUser1._id}/places/${place._id}`)
                    .send({ name: 'Hack Attempt' })
                    .expect(404);

                expect(res.body.error).toBeDefined();
            });
        });

        describe('DELETE /api/users/:userId/trips/:tripId/places/:placeId', () => {
            it('removes a place from a trip if it belongs to user', async () => {
                const user = await User.create({ email: 'removeplace@example.com' });
                const trip = await Trip.create({ name: 'RemovePlaceTrip', user: user._id });
                const place = await Place.create({ name: 'Old Restaurant' });

                trip.places.push(place._id);
                await trip.save();

                const res = await request(app)
                    .delete(`/api/users/${user._id}/trips/${trip._id}/places/${place._id}`)
                    .expect(200);

                expect(res.body).toHaveProperty('deletedPlace');
                expect(res.body.deletedPlace.name).toBe('Old Restaurant');

                // Confirm it's removed from the trip's places
                const updatedTrip = await Trip.findById(trip._id);
                expect(updatedTrip.places).toHaveLength(0);

                // Confirm the place doc is deleted if your route logic does so
                const checkPlace = await Place.findById(place._id);
                expect(checkPlace).toBeNull();
            });
        });
    });
});
