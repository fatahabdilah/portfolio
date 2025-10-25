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

// -----------------------------------------------------------
// | PUBLIC ROUTES (READ ACCESS)                             |
// -----------------------------------------------------------

/**
 * @route GET /api/skills
 * @desc Fetch all available skills.
 * @access Public (Anyone can view skills)
 */
router.get('/', getSkills);

/**
 * @route GET /api/skills/:id
 * @desc Fetch a single skill by ID.
 * @access Public
 */
router.get('/:id', getSkill);


// -----------------------------------------------------------
// | GLOBAL MIDDLEWARE: Secure modification routes           |
// -----------------------------------------------------------

/**
 * @desc Applies JWT authentication to all subsequent routes (POST, PATCH, DELETE).
 * Only authenticated Admin users can proceed beyond this point.
 */
router.use(requireAuth); 

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