// controller/urlController.js

const Url = require('../models/Url.js');
const shortid = require('shortid');
const { UAParser } = require('ua-parser-js');
const axios = require('axios');

// Utility: Get client IP, considering proxies and IPv6
const getClientIp = (req) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();
  if (ip && ip.startsWith('::ffff:')) ip = ip.substring(7);
  return ip;
};

// Controller: Redirect to original URL, log analytics
const redirectToOriginalUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    url.clicks++;
    let country = 'Unknown', countryCode = 'XX';
    const ip = getClientIp(req);

    // Do not lookup localhost IPs
    if (ip && ip !== '::1' && ip !== '127.0.0.1' && ip !== 'localhost') {
      try {
        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,countryCode`);
        if (geoResponse.data && geoResponse.data.status === 'success') {
          country = geoResponse.data.country;
          countryCode = geoResponse.data.countryCode;
        }
      } catch (geoError) {
        console.error(`Geolocation lookup failed for IP ${ip}:`, geoError.message);
      }
    } else if (ip) {
      country = 'Local';
      countryCode = 'LC';
    }

    // ---- FORCE TO INDIA FOR DEMO (TEST ONLY) ----
    if (country === 'Unknown' || country === 'Local') {
      country = 'India';
      countryCode = 'IN';
    }

    const parser = new UAParser(req.headers['user-agent']);
    const userAgentInfo = parser.getResult();
    let device = 'Desktop';
    if (userAgentInfo.device.type === 'mobile') device = 'Mobile';
    else if (userAgentInfo.device.type === 'tablet') device = 'Tablet';

    url.analytics.push({
      timestamp: new Date(),
      ipAddress: ip || 'Unknown',
      userAgent: req.headers['user-agent'],
      device,
      country,
      countryCode,
    });
    await url.save();
    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// **MODIFIED**: Controller: Shorten a URL or use custom alias
const shortenUrl = async (req, res) => {
    const { originalUrl, customAlias } = req.body;
    
    // The BASE_URL is now fetched from environment variables.
    // It is CRITICAL that you set this in your Render dashboard.
    const baseUrl = process.env.BASE_URL;

    // If BASE_URL is not set, the app cannot function correctly.
    if (!baseUrl) {
        console.error('FATAL: BASE_URL environment variable is not set.');
        return res.status(500).json({ error: 'Server configuration error: BASE_URL is missing.' });
    }

    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    try {
        // **FIX**: If the user provides a custom alias, check if it's already taken.
        if (customAlias) {
            const aliasExists = await Url.findOne({ shortId: customAlias });
            if (aliasExists) {
                return res.status(400).json({ error: 'That custom alias is already in use.' });
            }
        }

        // **FIX**: Always check if the original URL has been shortened before.
        // If it exists, return the existing short link to prevent duplicates.
        const existingUrl = await Url.findOne({ originalUrl });
        if (existingUrl) {
            return res.status(200).json({
                ...existingUrl.toObject(),
                message: "This URL has already been shortened. Here is the existing link."
            });
        }

        // If the URL is new and the alias is available, create a new entry.
        const shortId = customAlias || shortid.generate();
        const shortUrl = `${baseUrl}/${shortId}`;

        const newUrl = new Url({
            originalUrl,
            shortId,
            shortUrl,
            // Only add the customAlias field if it was provided
            ...(customAlias && { customAlias }),
        });

        await newUrl.save();
        res.status(201).json(newUrl);

    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'The generated ID or alias already exists. Please try again.' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};


// Controller: Return analytics for a short URL
const getAnalytics = async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    const analytics = url.analytics || [];

    // Click data by date
    const clicksByDate = analytics.reduce((acc, click) => {
      const date = new Date(click.timestamp || click.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const clickChartData = Object.keys(clicksByDate).map(date => ({ date, clicks: clicksByDate[date] }));

    // Device data
    const clicksByDevice = analytics.reduce((acc, click) => {
      const device = click.device || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});
    const deviceChartData = Object.keys(clicksByDevice).map(name => ({ name, clicks: clicksByDevice[name] }));

    // Country data - aggregate by name & code
    const clicksByCountry = analytics.reduce((acc, click) => {
      const country = click.country || 'Unknown';
      const code = click.countryCode || 'XX';
      const key = `${country}|${code}`;
      if (!acc[key]) acc[key] = { name: country, code, clicks: 0 };
      acc[key].clicks++;
      return acc;
    }, {});
    const worldMapData = Object.values(clicksByCountry);

    // Browser data
    const clicksByBrowser = analytics.reduce((acc, click) => {
      const ua = new UAParser(click.userAgent).getResult();
      const browserName = ua.browser.name || 'Unknown';
      acc[browserName] = (acc[browserName] || 0) + 1;
      return acc;
    }, {});
    const browserChartData = Object.keys(clicksByBrowser).map(name => ({ name, clicks: clicksByBrowser[name] }));

    res.json({
      totalClicks: url.clicks,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt,
      clickChartData,
      deviceChartData,
      worldMapData, // <--- use this for your world map
      browserChartData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller: Check if original URL exists
const checkUrlExists = async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: 'URL is required' });
  try {
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) return res.json({ exists: true, url: existingUrl });
    else return res.json({ exists: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller: Check if short URL exists by shortId
const checkShortUrlExists = async (req, res) => {
  const { shortId } = req.params;
  try {
    const url = await Url.findOne({ shortId });
    if (url) return res.json({ exists: true, url });
    else return res.json({ exists: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller: Get all URLs (admin/debug)
const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  shortenUrl,
  redirectToOriginalUrl,
  getAnalytics,
  checkUrlExists,
  checkShortUrlExists,
  getAllUrls,
};
