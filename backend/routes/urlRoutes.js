// routes/urlRoutes.js

const express = require('express');
const router = express.Router();
const {
    shortenUrl,
    getAnalytics,
    getAllUrls,
    // 'checkUrlExists' is now removed from the import
    checkShortUrlExists,
} = require('../controller/urlController');

// API endpoint to get all URLs
router.get('/', getAllUrls);

// **REMOVED**: The route for checking the original URL has been deleted.
// router.post('/check', checkUrlExists);

// API endpoint to check if a short link exists by its ID
// This is the ONLY way to check for analytics now.
router.get('/check-short/:shortId', checkShortUrlExists);

// API endpoint to create a new short URL
router.post('/shorten', shortenUrl);

// API endpoint to get analytics for a specific URL
router.get('/analytics/:shortId', getAnalytics);

module.exports = router;
