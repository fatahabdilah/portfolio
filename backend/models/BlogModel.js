// backend/models/BlogModel.js

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
 * @typedef Blog
 * @property {string} title - The title of the blog post.
 * @property {string} slug - The URL-friendly identifier generated from the title (Unique).
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

    // Blog Slug (NEW: Required, Unique, Indexed)
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
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

// -------------------------------------------------------------
// | Mongoose Middleware: Generate Unique Slug                 |
// -------------------------------------------------------------

/**
 * @desc Pre-save hook to generate and ensure a unique slug before saving.
 */
blogSchema.pre('save', async function(next) {
    if (this.isModified('title') || this.isNew) {
        let baseSlug = slugify(this.title);
        let slug = baseSlug;
        let count = 0;
        
        // Loop to check for uniqueness
        while (await mongoose.models.Blog.findOne({ slug: slug, _id: { $ne: this._id } })) {
            count++;
            slug = `${baseSlug}-${count}`;
        }
        this.slug = slug;
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);