// app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const tripRoutes = require('./routes/tripRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/trips', tripRoutes);

module.exports = app;