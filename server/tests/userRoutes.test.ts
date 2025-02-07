// tests/userRoutes.test.ts
import request from 'supertest';
import app from '../src/app';
import User from '../src/models/User';

// import './setup'; // if not using global jest setup

describe('User Routes', () => {
    it('POST /api/users - should create a new user', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ email: 'test@example.com' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.email).toBe('test@example.com');
    });

    it('GET /api/users - should return empty array initially', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('GET /api/users/:userId - returns 404 if user not found', async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        const res = await request(app).get(`/api/users/${fakeId}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('User not found');
    });

    it('GET /api/users/:userId - returns the user if found', async () => {
        const createdUser = await User.create({ email: 'single@user.com' });
        const res = await request(app).get(`/api/users/${createdUser._id}`);
        expect(res.status).toBe(200);
        expect(res.body.email).toBe('single@user.com');
    });
});
