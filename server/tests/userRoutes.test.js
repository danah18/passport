// tests/userRoutes.test.js
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('User Routes', () => {
    describe('POST /api/users', () => {
        it('creates a new user', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({ email: 'test@example.com' })
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.email).toBe('test@example.com');
        });

        it('fails if no email is provided', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({})
                .expect(400);

            expect(response.body.error).toBeDefined();
        });
    });

    describe('GET /api/users', () => {
        it('returns an empty array initially', async () => {
            const response = await request(app).get('/api/users').expect(200);
            expect(response.body).toEqual([]);
        });

        it('returns multiple users after creating them', async () => {
            await User.create({ email: 'user1@example.com' });
            await User.create({ email: 'user2@example.com' });

            const response = await request(app).get('/api/users').expect(200);
            expect(response.body.length).toBe(2);
        });
    });

    describe('GET /api/users/:userId', () => {
        it('returns a single user if found', async () => {
            const createdUser = await User.create({ email: 'oneUser@example.com' });
            const response = await request(app)
                .get(`/api/users/${createdUser._id}`)
                .expect(200);

            expect(response.body.email).toBe('oneUser@example.com');
        });

        it('returns 404 if user not found', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .get(`/api/users/${fakeId}`)
                .expect(404);

            expect(response.body.error).toBe('User not found');
        });
    });
});
