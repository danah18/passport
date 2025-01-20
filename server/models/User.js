// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true, // ensure no duplicate emails
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
