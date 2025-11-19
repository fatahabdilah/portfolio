// backend/models/BlogModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @typedef Blog
 * @property {string} title - The title of the blog post.
 * @property {string} content - The detailed content of the blog post (Markdown/HTML supported).
 * @property {string} thumbnailUrl - Secure URL for the main thumbnail image (Cloudinary).
 * @property {string} thumbnailPublicId - Cloudinary Public ID for asset management.
 * @property {ObjectId} user - Reference to the Admin user who owns the blog post.
 */
const blogSchema = new Schema({
    
    // Blog Title (Required and unique for SEO/readability)
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        unique: true,
        trim: true,
    },
    
    // Blog Content (Required)
    content: {
        type: String,
        required: [true, 'Blog content is required'],
    },
    
    // Main Thumbnail URL (Cloudinary storage link)
    thumbnailUrl: {
        type: String,
        required: [true, 'Blog thumbnail URL is required'],
    },
    
    // Cloudinary Public ID (For secure deletion/updating of assets)
    thumbnailPublicId: {
        type: String,
        required: true,
    },
    
    // Owner/Admin Reference (Authorization and data isolation)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the 'User' collection
        required: true,
    }
}, { 
    // Mongoose timestamps for tracking creation and updates
    timestamps: true 
});

// Catatan: Slug helper function dan pre('save') hook DIBATALKAN.

module.exports = mongoose.model('Blog', blogSchema);