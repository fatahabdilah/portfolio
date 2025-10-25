// backend/config/cloudinary.config.js

const cloudinary = require('cloudinary').v2;
// Note: dotenv is typically configured in the main server.js entry point,
// but including it here ensures environment variables are loaded for standalone use.

/**
 * @desc Configures the Cloudinary SDK using environment variables.
 */
cloudinary.config({
  // Configuration details are read directly from the environment variables (.env file)
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Forces asset URLs to use HTTPS for production security
});

module.exports = cloudinary;