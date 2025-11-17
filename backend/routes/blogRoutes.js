// backend/routes/blogRoutes.js

const express = require('express');
const { 
    createBlog, 
    getBlogs, 
    getBlog, 
    deleteBlog, 
    updateBlog 
} = require('../controllers/BlogController');
const requireAuth = require('../middleware/requireAuth'); // JWT Authentication Middleware
const uploadImageMiddleware = require('../middleware/uploadMiddleware'); // Multer Upload Middleware

const router = express.Router();

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
 * @route GET /api/blogs/:id
 * @desc Fetch a single blog post by its ID, including full content.
 * @access Public
 * @param {string} id - The MongoDB ObjectID of the blog post.
 * @returns {object} 200 - The requested Blog object.
 * @returns {object} 404 - { error: "No such blog post found." }
 */
router.get('/:id', getBlog);


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
    uploadImageMiddleware, 
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
router.delete('/:id', deleteBlog);

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
router.patch('/:id', 
    uploadImageMiddleware, 
    updateBlog
); 

module.exports = router;