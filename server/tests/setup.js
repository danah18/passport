// tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Spin up an in-memory MongoDB server before any tests run.
 */
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {});
});

/**
 * Drop all collections after each test to keep a clean slate.
 */
afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

/**
 * Close db connection and stop mongoServer after all tests.
 */
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
