// index.js
require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/passport';

// Connect to MongoDB (for production/dev)
mongoose
    .connect(MONGO_URI, {})
    .then(() => console.log('DB connected'))
    .catch((err) => console.error('DB Connection Error:', err));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});