// backend/routes/blogRoutes.js

const express = require('express');
const { 
    createBlog, 
    getBlogs, 
    getBlog, // Updated to handle slug/id
    deleteBlog, 
    updateBlog 
} = require('../controllers/BlogController');
const requireAuth = require('../middleware/requireAuth'); // JWT Authentication Middleware
const createUploadMiddleware = require('../middleware/uploadMiddleware'); // Multer Upload Middleware

const router = express.Router();

// Tentukan middleware unggahan untuk blog (field: 'thumbnail')
const blogThumbnailUpload = createUploadMiddleware('thumbnail');


// -----------------------------------------------------------
// | PUBLIC READ ROUTES (No Authentication Needed)             |
// -----------------------------------------------------------

/**
 * @route GET /api/blogs
 * @desc Fetch all blog posts for public display.
 * @access Public
 * @returns {array<object>} 200 - An array of Blog objects (without full content).
 */
router.get('/', getBlogs);

/**
 * @route GET /api/blogs/:slugOrId
 * @desc Fetch a single blog post by its SLUG (public) or ID (admin internal), including full content.
 * @access Public/Private (depending on the caller)
 * @param {string} slugOrId - The slug (for public) or ObjectID (for admin) of the blog post.
 * @returns {object} 200 - The requested Blog object.
 * @returns {object} 404 - { error: "No such blog post found." }
 */
router.get('/:slugOrId', getBlog); // 💡 PERUBAHAN: Menggunakan :slugOrId


// -----------------------------------------------------------
// | GLOBAL MIDDLEWARE: Secures all Modification Routes        |
// -----------------------------------------------------------

/**
 * @desc Applies JWT authentication to all subsequent routes (POST, PATCH, DELETE). 
 * Only authenticated Admin users can proceed.
 */
router.use(requireAuth); 

// -----------------------------------------------------------
// | PRIVATE MODIFICATION ROUTES (Admin Only)                  |
// -----------------------------------------------------------

/**
 * @route POST /api/blogs
 * @desc Create a new blog post, handling thumbnail upload to Cloudinary.
 * @access Private (Requires Admin Token)
 * @header {string} Authorization - Bearer <JWT Token>
 * @body {string} title - The blog title (required, unique).
 * @body {string} content - The blog content (required).
 * @body {file} thumbnail - The thumbnail image file (required, max 5MB).
 * @returns {object} 201 - The newly created Blog object.
 * @returns {object} 400 - { error: "Validation failed" } or { error: "Image upload failed" }
 */
router.post('/', 
    blogThumbnailUpload, 
    createBlog
);

/**
 * @route DELETE /api/blogs/:id
 * @desc Delete a blog post and its associated thumbnail from Cloudinary.
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @param {string} id - The MongoDB ObjectID of the blog post to delete.
 * @returns {object} 200 - { message: "Blog post deleted successfully!" }
 */
router.delete('/:id', deleteBlog); // Tetap menggunakan :id untuk operasi Admin

/**
 * @route PATCH /api/blogs/:id
 * @desc Update an existing blog post (title, content, and optionally thumbnail).
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @param {string} id - The MongoDB ObjectID of the blog post to update.
 * @body {string} [title] - Optional new title (must be unique).
 * @body {string} [content] - Optional new content.
 * @body {file} [thumbnail] - Optional new image file to replace the old one.
 * @returns {object} 200 - The updated Blog object.
 */
router.patch('/:id', // Tetap menggunakan :id untuk operasi Admin
    blogThumbnailUpload, 
    updateBlog
); 

module.exports = router;