// backend/models/PasswordResetTokenModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @typedef PasswordResetToken
 * @property {ObjectId} userId - Reference to the User who requested the password reset.
 * @property {string} token - The raw token string stored in the database.
 * @property {Date} expiresAt - The timestamp when this token becomes invalid (used for TTL).
 */
const PasswordResetTokenSchema = new Schema({
    // Foreign Key: Reference to the User Model
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    
    // The raw token string (Crypto Random String)
    token: {
        type: String,
        required: true,
    },
    
    // Expiration date for the token (e.g., 1 hour)
    expiresAt: {
        type: Date,
        required: true,
        // PRO ENHANCEMENT: Create a TTL index on this field 
        // to automatically delete the document when the time is reached.
        index: { expires: 0 }, 
    },
    
    // REMOVED: createdAt field because it is now redundant with expiresAt for TTL indexing.
}, { 
    // Disable automatic timestamps since we only need the custom 'expiresAt' field
    timestamps: false 
});

module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);