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
// | PUBLIC READ ROUTES (No Authentication Needed)           |
// -----------------------------------------------------------

// NOTE: These routes are PUBLIC because they are placed BEFORE router.use(requireAuth).

/**
 * @route GET /api/projects
 * @desc Fetch all projects (for display on the public portfolio).
 * @access Public
 */
router.get('/', getProjects);

/**
 * @route GET /api/projects/:id
 * @desc Fetch a single project by ID.
 * @access Public
 */
router.get('/:id', getProject);


// -----------------------------------------------------------
// | GLOBAL MIDDLEWARE: Secures all Modification Routes      |
// -----------------------------------------------------------

/**
 * @desc Applies JWT authentication to all subsequent routes.
 * Only authenticated Admin users can proceed beyond this point.
 */
router.use(requireAuth); 

// -----------------------------------------------------------
// | PRIVATE MODIFICATION ROUTES (Admin Only)                |
// -----------------------------------------------------------

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
    uploadImageMiddleware, 
    updateProject
); 

module.exports = router;