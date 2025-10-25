// backend/models/SkillModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Wajib: Import Project Model untuk operasi cascade delete
const Project = require('./ProjectModel'); 

/**
 * @typedef Skill
 * @property {string} name - The name of the technology or skill (e.g., 'React.js', 'MongoDB').
 * @property {ObjectId} user - Reference to the Admin user who owns this skill entry.
 */
const skillSchema = new Schema({
    // Skill Name (Required, Unique, and trimmed)
    name: {
        type: String,
        required: [true, 'Skill name is required'],
        unique: true, // Ensures no duplicate skill names
        trim: true,
    },
    // Owner/Admin Reference (Authorization and data isolation)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the 'User' collection
        required: true,
    }
}, { 
    timestamps: true // Adds createdAt and updatedAt fields
});


// -------------------------------------------------------------
// | Mongoose Middleware: Cascade Delete References            |
// -------------------------------------------------------------

/**
 * @desc Mongoose 'pre' hook that runs BEFORE a Skill document is deleted (via findOneAndDelete).
 * This ensures that the Skill's ID is safely removed from all Project documents that reference it,
 * maintaining database integrity (Cascade Delete).
 */
skillSchema.pre('findOneAndDelete', async function(next) {
    // Get the ID of the skill being deleted from the query object
    const skillId = this.getQuery()._id; 

    try {
        console.log(`[DB CASCADE] Initiating cleanup for Skill ID: ${skillId}`);
        
        // Use $pull operator to remove the skillId from the 'technologies' array
        // across all Project documents. This is highly efficient.
        await Project.updateMany(
            { technologies: skillId }, // Filter: Projects containing this Skill ID
            { $pull: { technologies: skillId } } // $pull: Remove the specific ID
        );

        console.log(`[DB CASCADE] Successfully removed reference from all linked projects.`);
        next(); // Proceed to delete the Skill document
    } catch (error) {
        console.error(`[DB CASCADE ERROR] Failed to clean up project references: ${error.message}`);
        // Pass the error back to the deletion process
        next(error); 
    }
});


module.exports = mongoose.model('Skill', skillSchema);