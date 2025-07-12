// utils/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // The options 'useNewUrlParser' and 'useUnifiedTopology' are no longer needed
    // in recent versions of Mongoose.
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;