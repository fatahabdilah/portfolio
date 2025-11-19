// backend/models/ProjectModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Helper function to generate a URL-friendly slug from a string.
 * @param {string} text 
 * @returns {string} The generated slug.
 */
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars
        .replace(/[\s-]+/g, '-')      // Collapse whitespace and hyphens
        .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
};

/**
 * @typedef Project
 * @property {string} title - The title of the project.
 * @property {string} slug - The URL-friendly identifier generated from the title (Unique).
 * @property {string} description - A detailed description of the project.
 * @property {Array<ObjectId>} technologies - References to the Technology model.
 * @property {string} imageUrl - Secure URL for the main image (hosted on Cloudinary).
 * @property {string} imagePublicId - Cloudinary Public ID for asset management.
 * @property {string} demoUrl - Optional URL for the live demo.
 * @property {string} repoUrl - Optional URL for the GitHub repository.
 * @property {ObjectId} user - Reference to the Admin user who owns the project.
 */
const projectSchema = new Schema({
    
    // Project Title (Required and trim whitespace)
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
    },
    
    // Project Slug (NEW: Required, Unique, Indexed)
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    
    // Project Description (Required)
    description: {
        type: String,
        required: [true, 'Project description is required'],
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
    
    // Optional Repository Link (Whitespace removed)
    repoUrl: {
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


// -------------------------------------------------------------
// | Mongoose Middleware: Generate Unique Slug                 |
// -------------------------------------------------------------

/**
 * @desc Pre-save hook to generate and ensure a unique slug before saving.
 */
projectSchema.pre('save', async function(next) {
    if (this.isModified('title') || this.isNew) {
        let baseSlug = slugify(this.title);
        let slug = baseSlug;
        let count = 0;
        
        // Loop to check for uniqueness
        while (await mongoose.models.Project.findOne({ slug: slug, _id: { $ne: this._id } })) {
            count++;
            slug = `${baseSlug}-${count}`;
        }
        this.slug = slug;
    }
    next();
});

module.exports = mongoose.model('Project', projectSchema);