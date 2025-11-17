// backend/controllers/SkillController.js

const Skill = require('../models/SkillModel');
const mongoose = require('mongoose');

/**
 * @desc Handles Mongoose duplicate key error (code 11000).
 * @param {Object} res - Express response object.
 * @param {string} name - The name of the skill being processed.
 * @returns {Object} The error response object.
 */
const handleDuplicateKeyError = (res, name) => {
    return res.status(400).json({ error: `Skill '${name}' already exists.` });
};


/**
 * @desc Creates a new skill entry.
 * @route POST /api/skills
 * @access Private (Admin Only)
 */
const createSkill = async (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;

    try {
        const skill = await Skill.create({
            name,
            user: userId,
        });
        res.status(201).json(skill);
    } catch (error) {
        if (error.code === 11000) {
            return handleDuplicateKeyError(res, name);
        }
        // PRO ENHANCEMENT: Return a generic validation error message instead of error.message
        res.status(400).json({ error: 'Skill validation failed.' });
    }
};


/**
 * @desc Fetches all skills, sorted alphabetically.
 * @route GET /api/skills
 * @access Private (Admin Only)
 */
const getSkills = async (req, res) => {
    try {
        // Fetch all skills, ordered by name (ascending)
        const skills = await Skill.find({}).sort({ name: 1 });
        res.status(200).json(skills);
    } catch (error) {
        // PRO ENHANCEMENT: Use a general server error message
        res.status(500).json({ error: 'Server failed to retrieve skills.' }); 
    }
};


/**
 * @desc Fetches a single skill by its ID.
 * @route GET /api/skills/:id
 * @access Private (Admin Only)
 */
const getSkill = async (req, res) => {
    const { id } = req.params;

    // Validate ID format early
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such skill found.' });
    }

    try {
        const skill = await Skill.findById(id);

        if (!skill) {
            return res.status(404).json({ error: 'No such skill found.' });
        }

        res.status(200).json(skill);
    } catch (error) {
        // Catch any potential DB/server error during findById
        res.status(500).json({ error: 'Server failed to retrieve skill.' });
    }
};


/**
 * @desc Updates a skill's name by its ID. Requires ownership authorization.
 * @route PATCH /api/skills/:id
 * @access Private (Admin Only)
 */
const updateSkill = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such skill found.' });
    }

    try {
        // Find and update skill, ensuring ownership
        const skill = await Skill.findOneAndUpdate(
            { _id: id, user: userId }, 
            { name }, 
            { new: true, runValidators: true } 
        );

        if (!skill) {
            // Returns 404 if ID is valid but either not found or doesn't belong to the user
            return res.status(404).json({ error: 'No such skill or not authorized to update.' });
        }

        res.status(200).json(skill);
    } catch (error) {
        if (error.code === 11000) {
            return handleDuplicateKeyError(res, name);
        }
        // PRO ENHANCEMENT: Return a generic validation error message
        res.status(400).json({ error: 'Skill update validation failed.' });
    }
};


/**
 * @desc Deletes a skill by its ID. Requires ownership authorization.
 * @route DELETE /api/skills/:id
 * @access Private (Admin Only)
 */
const deleteSkill = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such skill found.' });
    }

    try {
        // Find and delete, ensuring ownership
        const skill = await Skill.findOneAndDelete({ _id: id, user: userId });

        if (!skill) {
            return res.status(404).json({ error: 'No such skill or not authorized to delete.' });
        }

        res.status(200).json({ message: 'Skill deleted successfully!', skill });
    } catch (error) {
        // Catch server-side error during deletion (e.g., cascade hook failure)
        console.error('Skill deletion failed:', error.message);
        res.status(500).json({ error: 'Server failed to delete skill due to a database issue.' });
    }
};


module.exports = {
    createSkill,
    getSkills,
    getSkill,
    updateSkill,
    deleteSkill
};