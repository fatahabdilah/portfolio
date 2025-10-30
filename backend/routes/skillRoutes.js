// backend/routes/skillRoutes.js

const express = require('express');
const { 
    createSkill, 
    getSkills, 
    getSkill, 
    updateSkill, 
    deleteSkill 
} = require('../controllers/SkillController');
const requireAuth = require('../middleware/requireAuth'); // JWT Authentication Middleware

const router = express.Router();

/**
 * @desc Applies JWT authentication to ALL subsequent Skill routes.
 * Read and Write access requires a valid Admin token.
 */
router.use(requireAuth); 

// -----------------------------------------------------------
// | PRIVATE ROUTES (Read & Modification Access)               |
// -----------------------------------------------------------

/**
 * @route GET /api/skills
 * @desc Fetches all available skills, sorted alphabetically.
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @returns {array<object>} 200 - An array of Skill objects.
 * @returns {object} 401 - { error: "Request is unauthorized" }
 */
router.get('/', getSkills);

/**
 * @route GET /api/skills/:id
 * @desc Fetches a single skill by ID.
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @param {string} id - The MongoDB ObjectID of the skill.
 * @returns {object} 200 - The requested Skill object.
 * @returns {object} 404 - { error: "No such skill found." }
 */
router.get('/:id', getSkill);

/**
 * @route POST /api/skills
 * @desc Create a new skill entry.
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @body {string} name - The unique name of the skill (required).
 * @returns {object} 201 - The newly created Skill object.
 * @returns {object} 400 - { error: "Skill '...' already exists." } or { error: "Validation error" }
 * @returns {object} 401 - { error: "Request is unauthorized" }
 */
router.post('/', createSkill);

/**
 * @route PATCH /api/skills/:id
 * @desc Update a skill's name. Requires ownership authorization.
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @param {string} id - The MongoDB ObjectID of the skill to update.
 * @body {string} name - The new unique name of the skill (required).
 * @returns {object} 200 - The updated Skill object.
 * @returns {object} 400 - { error: "Skill '...' already exists." } or { error: "Validation error" }
 * @returns {object} 401 - { error: "Request is unauthorized" }
 * @returns {object} 404 - { error: "No such skill or not authorized to update." }
 */
router.patch('/:id', updateSkill);

/**
 * @route DELETE /api/skills/:id
 * @desc Delete a skill. Deletion automatically removes references from all related projects (cascade delete).
 * @access Private (Admin Only)
 * @header {string} Authorization - Bearer <JWT Token>
 * @param {string} id - The MongoDB ObjectID of the skill to delete.
 * @returns {object} 200 - { message: "Skill deleted successfully!", skill: <deleted Skill object> }
 * @returns {object} 401 - { error: "Request is unauthorized" }
 * @returns {object} 404 - { error: "No such skill or not authorized to delete." }
 */
router.delete('/:id', deleteSkill);


module.exports = router;