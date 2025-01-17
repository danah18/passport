// tests/tripRoutes.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Our Express app (no .listen call)
const Trip = require('../models/Trip'); // Mongoose model for Trip

let mongoServer;

// A helper function to connect to our in-memory database
const connectInMemoryDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect Mongoose to the in-memory URI
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const closeInMemoryDB = async () => {
  // Close Mongoose connection, then stop the in-memory server
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

describe('Trip Routes', () => {
  // Before running any tests, connect to an in-memory DB
  beforeAll(async () => {
    await connectInMemoryDB();
  });

  // After all tests, close DB
  afterAll(async () => {
    await closeInMemoryDB();
  });

  // Clear database between tests (optional)
  afterEach(async () => {
    await Trip.deleteMany(); 
    // or dropDatabase() entirely
  });

  describe('POST /api/trips', () => {
    it('should create a new Trip', async () => {
      const res = await request(app)
        .post('/api/trips')
        .send({ name: 'Thailand Adventure', description: 'Fun trip to Thailand' })
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe('Thailand Adventure');
      expect(res.body.description).toBe('Fun trip to Thailand');
    });

    it('should fail with 400 if no name is provided', async () => {
      const res = await request(app)
        .post('/api/trips')
        .send({ description: 'Missing name' })
        .expect(400);

      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/trips', () => {
    it('should return an empty array initially', async () => {
      const res = await request(app).get('/api/trips').expect(200);
      expect(res.body).toEqual([]);
    });

    it('should return an array of trips', async () => {
      // Insert test data directly
      await Trip.create({ name: 'Test Trip 1' });
      await Trip.create({ name: 'Test Trip 2' });

      const res = await request(app).get('/api/trips').expect(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name', 'Test Trip 1');
      expect(res.body[1]).toHaveProperty('name', 'Test Trip 2');
    });
  });

  describe('GET /api/trips/:tripId', () => {
    it('should get a single trip by ID', async () => {
      const trip = await Trip.create({ name: 'Single Trip' });

      const res = await request(app).get(`/api/trips/${trip._id}`).expect(200);
      expect(res.body).toHaveProperty('_id', trip._id.toString());
      expect(res.body.name).toBe('Single Trip');
    });

    it('should return 404 if trip not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/trips/${nonExistentId}`).expect(404);
      expect(res.body.error).toBe('Trip not found');
    });
  });

  describe('PUT /api/trips/:tripId', () => {
    it('should update an existing trip', async () => {
      const trip = await Trip.create({ name: 'Old Trip' });

      const res = await request(app)
        .put(`/api/trips/${trip._id}`)
        .send({ name: 'Updated Trip Name' })
        .expect(200);

      expect(res.body.name).toBe('Updated Trip Name');
    });

    it('should return 404 if trying to update a non-existing trip', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/trips/${nonExistentId}`)
        .send({ name: 'Won’t work' })
        .expect(404);

      expect(res.body.error).toBe('Trip not found');
    });
  });

  describe('DELETE /api/trips/:tripId', () => {
    it('should delete an existing trip', async () => {
      const trip = await Trip.create({ name: 'Trip to delete' });

      const res = await request(app).delete(`/api/trips/${trip._id}`).expect(200);
      expect(res.body.message).toBe('Trip deleted successfully');

      // Confirm it was deleted
      const found = await Trip.findById(trip._id);
      expect(found).toBeNull();
    });

    it('should return 404 if trip not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/trips/${nonExistentId}`).expect(404);
      expect(res.body.error).toBe('Trip not found');
    });
  });
});
