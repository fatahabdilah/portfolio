// backend/controllers/TechnologyController.js

const Technology = require('../models/TechnologyModel'); // Updated model name
const mongoose = require('mongoose');

/**
 * @desc Handles Mongoose duplicate key error (code 11000).
 * @param {Object} res - Express response object.
 * @param {string} name - The name of the technology being processed.
 * @returns {Object} The error response object.
 */
const handleDuplicateKeyError = (res, name) => {
    return res.status(400).json({ error: `Technology '${name}' already exists.` });
};


/**
 * @desc Creates a new technology entry.
 * @route POST /api/technologies
 * @access Private (Admin Only)
 */
const createTechnology = async (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;

    try {
        const technology = await Technology.create({
            name,
            user: userId,
        });
        res.status(201).json(technology);
    } catch (error) {
        if (error.code === 11000) {
            return handleDuplicateKeyError(res, name);
        }
        // PRO ENHANCEMENT: Return a generic validation error message instead of error.message
        res.status(400).json({ error: 'Technology validation failed.' });
    }
};


/**
 * @desc Fetches all technologies, sorted alphabetically.
 * @route GET /api/technologies
 * @access Private (Admin Only)
 */
const getTechnologies = async (req, res) => {
    try {
        // Fetch all technologies, ordered by name (ascending)
        const technologies = await Technology.find({}).sort({ name: 1 });
        res.status(200).json(technologies);
    } catch (error) {
        // PRO ENHANCEMENT: Use a general server error message
        res.status(500).json({ error: 'Server failed to retrieve technologies.' }); 
    }
};


/**
 * @desc Fetches a single technology by its ID.
 * @route GET /api/technologies/:id
 * @access Private (Admin Only)
 */
const getTechnology = async (req, res) => {
    const { id } = req.params;

    // Validate ID format early
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such technology found.' });
    }

    try {
        const technology = await Technology.findById(id);

        if (!technology) {
            return res.status(404).json({ error: 'No such technology found.' });
        }

        res.status(200).json(technology);
    } catch (error) {
        // Catch any potential DB/server error during findById
        res.status(500).json({ error: 'Server failed to retrieve technology.' });
    }
};


/**
 * @desc Updates a technology's name by its ID. Requires ownership authorization.
 * @route PATCH /api/technologies/:id
 * @access Private (Admin Only)
 */
const updateTechnology = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such technology found.' });
    }

    try {
        // Find and update technology, ensuring ownership
        const technology = await Technology.findOneAndUpdate(
            { _id: id, user: userId }, 
            { name }, 
            { new: true, runValidators: true } 
        );

        if (!technology) {
            // Returns 404 if ID is valid but either not found or doesn't belong to the user
            return res.status(404).json({ error: 'No such technology or not authorized to update.' });
        }

        res.status(200).json(technology);
    } catch (error) {
        if (error.code === 11000) {
            return handleDuplicateKeyError(res, name);
        }
        // PRO ENHANCEMENT: Return a generic validation error message
        res.status(400).json({ error: 'Technology update validation failed.' });
    }
};


/**
 * @desc Deletes a technology by its ID. Requires ownership authorization.
 * @route DELETE /api/technologies/:id
 * @access Private (Admin Only)
 */
const deleteTechnology = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such technology found.' });
    }

    try {
        // Find and delete, ensuring ownership
        const technology = await Technology.findOneAndDelete({ _id: id, user: userId });

        if (!technology) {
            return res.status(404).json({ error: 'No such technology or not authorized to delete.' });
        }

        res.status(200).json({ message: 'Technology deleted successfully!', technology });
    } catch (error) {
        // Catch server-side error during deletion (e.g., cascade hook failure)
        console.error('Technology deletion failed:', error.message);
        res.status(500).json({ error: 'Server failed to delete technology due to a database issue.' });
    }
};


module.exports = {
    createTechnology,
    getTechnologies,
    getTechnology,
    updateTechnology,
    deleteTechnology
};