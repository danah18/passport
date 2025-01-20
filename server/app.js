// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Route files
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Mount the routes:
// - /api/users -> userRoutes
// - /api/users -> tripRoutes (so that nested paths like /:userId/trips work)
app.use('/api/users', userRoutes);
app.use('/api/users', tripRoutes);

module.exports = app;