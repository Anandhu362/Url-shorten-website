// server.js

require('dotenv').config();
const app = require('./app'); // The app object is imported from app.js
const connectDB = require('./utils/db');

// --- CRUCIAL CONFIGURATION ---
// This tells Express to trust the 'x-forwarded-for' header set by proxies.
// It is the most important step for geolocation to work in production.
app.set('trust proxy', 1);

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));