// routes/urlRoutes.js

const express = require('express');
const router = express.Router();
const {
    shortenUrl,
    getAnalytics,
    getAllUrls, // This will now import correctly
    checkUrlExists,
    checkShortUrlExists,
} = require('../controller/urlController');

// API endpoint to get all URLs
// This route was causing the crash
router.get('/', getAllUrls);

// API endpoint to check if an original URL exists
router.post('/check', checkUrlExists);

// API endpoint to check if a short link exists by its ID
router.get('/check-short/:shortId', checkShortUrlExists);

// API endpoint to create a new short URL
router.post('/shorten', shortenUrl);

// API endpoint to get analytics for a specific URL
router.get('/analytics/:shortId', getAnalytics);

module.exports = router;