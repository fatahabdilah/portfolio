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
const uploadImageMiddleware = require('../middleware/upload.middleware'); // Multer Upload Middleware

const router = express.Router();

// -----------------------------------------------------------
// | GLOBAL MIDDLEWARE: Secure all modification routes below |
// -----------------------------------------------------------

/**
 * @desc Applies JWT authentication to all subsequent routes in this file.
 * All POST, DELETE, and PATCH methods are now protected.
 */
router.use(requireAuth); 


// -----------------------------------------------------------
// | PROJECT ROUTES (CRUD OPERATIONS)                        |
// -----------------------------------------------------------

/**
 * @route GET /api/projects
 * @desc Fetch all projects.
 * @access Private (Currently secured by router.use(requireAuth))
 */
router.get('/', getProjects);

/**
 * @route GET /api/projects/:id
 * @desc Fetch a single project by ID.
 * @access Private
 */
router.get('/:id', getProject);

/**
 * @route POST /api/projects
 * @desc Create a new project (requires file upload).
 * @access Private
 */
router.post('/', 
    uploadImageMiddleware, 
    createProject
);

/**
 * @route DELETE /api/projects/:id
 * @desc Delete a project (requires ownership authorization).
 * @access Private
 */
router.delete('/:id', deleteProject);

/**
 * @route PATCH /api/projects/:id
 * @desc Update a project (can update text fields or replace the image).
 * @access Private
 */
router.patch('/:id', 
    uploadImageMiddleware, // Needs Multer to process potential image update
    updateProject
); 

module.exports = router;