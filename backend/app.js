// app.js

const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');
const { redirectToOriginalUrl } = require('./controller/urlController');

const app = express();

// Trust the first proxy. This is important for getting the correct IP address
// when your app is behind a reverse proxy like the one Render uses.
app.set('trust proxy', 1);

// **MODIFIED**: CORS Configuration
// This setup is more secure and flexible for production.
const allowedOrigins = [
  'http://localhost:5173', // For local development
  // We will pull the production frontend URL from environment variables.
];

// Add the production frontend URL from environment variables if it exists.
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like server-to-server, or mobile apps)
    if (!origin) return callback(null, true);

    // If the origin is in our allowed list, allow it.
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Otherwise, block it.
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));


app.use(express.json());

// API routes
app.use('/api/urls', urlRoutes);

// Redirect route for short links
app.get('/:shortId', redirectToOriginalUrl);

// Health check route
app.get('/', (req, res) => {
  res.send('API is working!');
});

module.exports = app;
