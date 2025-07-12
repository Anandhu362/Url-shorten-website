// models/Url.js
const mongoose = require('mongoose');

// Define schema for individual analytics record
const analyticsSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String,
  device: String,
  country: String,
  countryCode: String,
});

// Define main URL schema
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  shortUrl: { type: String, required: true },
  customAlias: { type: String, unique: true, sparse: true }, // optional custom alias
  clicks: { type: Number, default: 0 },
  analytics: [analyticsSchema], // embed analytics subdocuments
}, { timestamps: true }); // adds createdAt & updatedAt

module.exports = mongoose.model('Url', urlSchema);
