// backend/routes/technologyRoutes.js

const express = require('express');
const { 
    createTechnology, 
    getTechnologies, 
    getTechnology, 
    updateTechnology, 
    deleteTechnology 
} = require('../controllers/TechnologyController'); // Updated import
const requireAuth = require('../middleware/requireAuth'); // JWT Authentication Middleware

const router = express.Router();

/**
 * @desc Applies JWT authentication to ALL subsequent Technology routes.
 * Read and Write access requires a valid Admin token.
 */
router.use(requireAuth); 

// -----------------------------------------------------------
// | PRIVATE ROUTES (Read & Modification Access)               |
// -----------------------------------------------------------

/**
 * @route GET /api/technologies
 * @desc Fetches all available technologies, sorted alphabetically.
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @returns {array<object>} 200 - An array of Technology objects.
 * @returns {object} 401 - { error: "Request is unauthorized" }
 */
router.get('/', getTechnologies);

/**
 * @route GET /api/technologies/:id
 * @desc Fetches a single technology by ID.
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @param {string} id - The MongoDB ObjectID of the technology.
 * @returns {object} 200 - The requested Technology object.
 * @returns {object} 404 - { error: "No such technology found." }
 */
router.get('/:id', getTechnology);

/**
 * @route POST /api/technologies
 * @desc Create a new technology entry.
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @body {string} name - The unique name of the technology (required).
 * @returns {object} 201 - The newly created Technology object.
 * @returns {object} 400 - { error: "Technology '...' already exists." } or { error: "Validation error" }
 * @returns {object} 401 - { error: "Request is unauthorized" }
 */
router.post('/', createTechnology);

/**
 * @route PATCH /api/technologies/:id
 * @desc Update a technology's name. Requires ownership authorization.
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @param {string} id - The MongoDB ObjectID of the technology to update.
 * @body {string} name - The new unique name of the technology (required).
 * @returns {object} 200 - The updated Technology object.
 * @returns {object} 400 - { error: "Technology '...' already exists." } or { error: "Validation error" }
 * @returns {object} 401 - { error: "Request is unauthorized" }
 * @returns {object} 404 - { error: "No such technology or not authorized to update." }
 */
router.patch('/:id', updateTechnology);

/**
 * @route DELETE /api/technologies/:id
 * @desc Delete a technology. Deletion automatically removes references from all related projects (cascade delete).
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @param {string} id - The MongoDB ObjectID of the technology to delete.
 * @returns {object} 200 - { message: "Technology deleted successfully!", technology: <deleted Technology object> }
 * @returns {object} 401 - { error: "Request is unauthorized" }
 * @returns {object} 404 - { error: "No such technology or not authorized to delete." }
 */
router.delete('/:id', deleteTechnology);


module.exports = router;