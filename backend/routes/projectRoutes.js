// backend/routes/projectRoutes.js

const express = require('express');
const { 
    createProject, 
    getProjects, 
    getProject, 
    deleteProject, 
    updateProject 
} = require('../controllers/ProjectController');
const requireAuth = require('../middleware/requireAuth'); // JWT Authentication Middleware
const uploadImageMiddleware = require('../middleware/uploadMiddleware'); // Multer Upload Middleware

const router = express.Router();

// -----------------------------------------------------------
// | PUBLIC READ ROUTES (No Authentication Needed)             |
// -----------------------------------------------------------

/**
 * @route GET /api/projects
 * @desc Fetch all projects for display on the public portfolio. Populates technology names.
 * @access Public
 * @returns {array<object>} 200 - An array of Project objects.
 * @returns {object} 500 - { error: "..." }
 */
router.get('/', getProjects);

/**
 * @route GET /api/projects/:id
 * @desc Fetch a single project by its ID, populating technology names.
 * @access Public
 * @param {string} id - The MongoDB ObjectID of the project.
 * @returns {object} 200 - The requested Project object.
 * @returns {object} 404 - { error: "No such project" }
 */
router.get('/:id', getProject);


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
 * @route POST /api/projects
 * @desc Create a new project, handling image upload to Cloudinary and database storage.
 * @access Private (Requires Admin Token)
 * @header {string} Authorization - Bearer <JWT Token>
 * @body {string} title - The project title (required).
 * @body {string} description - The project description (required).
 * @body {string} technologies - Comma-separated list of Skill Object IDs (required).
 * @body {file} projectImage - The main image file (required, max 5MB).
 * @returns {object} 201 - The newly created Project object.
 * @returns {object} 400 - { error: "Validation failed" } or { error: "Image upload failed" }
 * @returns {object} 401 - { error: "Request is unauthorized" }
 */
router.post('/', 
    uploadImageMiddleware, 
    createProject
);

/**
 * @route DELETE /api/projects/:id
 * @desc Delete a project and its associated image from Cloudinary. Requires authorization and ownership.
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @param {string} id - The MongoDB ObjectID of the project to delete.
 * @returns {object} 200 - { message: "Project deleted successfully!" }
 * @returns {object} 401 - { error: "Request is unauthorized" }
 * @returns {object} 404 - { error: "No such project or not authorized to delete" }
 */
router.delete('/:id', deleteProject);

/**
 * @route PATCH /api/projects/:id
 * @desc Update an existing project. Can update text fields and optionally replace the image.
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @param {string} id - The MongoDB ObjectID of the project to update.
 * @body {string} [title] - Optional new title.
 * @body {string} [technologies] - Optional comma-separated list of new Skill Object IDs.
 * @body {file} [projectImage] - Optional new image file to replace the old one.
 * @returns {object} 200 - The updated Project object.
 * @returns {object} 400 - { error: "Validation failed" }
 * @returns {object} 401 - { error: "Request is unauthorized" }
 * @returns {object} 404 - { error: "No such project or not authorized to update" }
 */
router.patch('/:id', 
    uploadImageMiddleware, 
    updateProject
); 

module.exports = router;