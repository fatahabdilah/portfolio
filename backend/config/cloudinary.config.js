const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Pastikan variabel dibaca

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Gunakan HTTPS
});

module.exports = cloudinary;