// backend/models/ProjectModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @typedef Project
 * @property {string} title - The title of the project.
 * @property {string} content - The detailed content/description of the project. 
 * @property {Array<ObjectId>} technologies - References to the Technology model.
 * @property {string} imageUrl - Secure URL for the main image (hosted on Cloudinary).
 * @property {string} imagePublicId - Cloudinary Public ID for asset management.
 * @property {string} demoUrl - Optional URL for the live demo.
 * @property {ObjectId} user - Reference to the Admin user who owns the project.
 */
const projectSchema = new Schema({
    
    // Project Title (Required and trim whitespace)
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
    },
    
    // Project Content (Replaces description)
    content: {
        type: String,
        required: [true, 'Project content is required'],
    },
    
    // Array of Technologies (References to Technology Model)
    technologies: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technology', // References the 'Technology' collection
    }],
    
    // Main Image URL (Cloudinary storage link)
    imageUrl: {
        type: String,
        required: [true, 'Project image URL is required'],
    },
    
    // Cloudinary Public ID (For secure deletion/updating of assets)
    imagePublicId: {
        type: String,
        required: true,
    },
    
    // Optional Demo Link (Whitespace removed)
    demoUrl: {
        type: String,
        trim: true,
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

module.exports = mongoose.model('Project', projectSchema);