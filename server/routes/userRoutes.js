// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');

/* 
  CREATE a new user
  POST /api/users
*/
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const newUser = await User.create({ email });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/* 
  GET all users
  GET /api/users
*/
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 
  GET a single user
  GET /api/users/:userId
*/
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
