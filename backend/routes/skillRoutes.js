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

// NOTE: This global middleware is placed before the GET routes, effectively securing them.
router.use(requireAuth); 

// -----------------------------------------------------------
// | PUBLIC ROUTES (READ ACCESS) - Secured by Global Middleware |
// -----------------------------------------------------------

/**
 * @route GET /api/skills
 * @desc Fetches all available skills.
 * @access Private (Secured by router.use(requireAuth) above)
 */
router.get('/', getSkills);

/**
 * @route GET /api/skills/:id
 * @desc Fetches a single skill by ID.
 * @access Private
 */
router.get('/:id', getSkill);


// -----------------------------------------------------------
// | GLOBAL MIDDLEWARE: Secure modification routes           |
// -----------------------------------------------------------

/**
 * @desc Applies JWT authentication to all subsequent routes (POST, PATCH, DELETE).
 * Only authenticated Admin users can proceed beyond this point.
 */

// -----------------------------------------------------------
// | PRIVATE ROUTES (MODIFICATION ACCESS)                    |
// -----------------------------------------------------------

/**
 * @route POST /api/skills
 * @desc Create a new skill entry.
 * @access Private
 */
router.post('/', createSkill);

/**
 * @route PATCH /api/skills/:id
 * @desc Update a skill's name (Requires ownership).
 * @access Private
 */
router.patch('/:id', updateSkill);

/**
 * @route DELETE /api/skills/:id
 * @desc Delete a skill (Requires ownership and cascade dependency check).
 * @access Private
 */
router.delete('/:id', deleteSkill);


module.exports = router;