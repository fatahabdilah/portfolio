// backend/models/PasswordResetTokenModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @typedef PasswordResetToken
 * @property {ObjectId} userId - Reference to the User who requested the password reset.
 * @property {string} token - The hashed token string stored in the database.
 * @property {Date} expiresAt - The timestamp when this token becomes invalid.
 * @property {Date} createdAt - The timestamp when this document was created.
 */
const PasswordResetTokenSchema = new Schema({
    // Foreign Key: Reference to the User Model
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    
    // The hashed token used for comparison (not the raw token sent in the email)
    token: {
        type: String,
        required: true,
    },
    
    // Expiration date for the token (e.g., 1 hour)
    expiresAt: {
        type: Date,
        required: true,
    },
    
    // Auto-delete mechanism (TTL Index)
    // The index definition will be added in server initialization or separate script.
    // However, defining `expiresAt` with the intent for TTL index is crucial.
    createdAt: {
        type: Date,
        default: Date.now,
        // PRO ENHANCEMENT: Create a TTL (Time-To-Live) index on this field 
        // to automatically delete the document after a specified time.
        index: { expires: '3600s' }, // Token is valid for 1 hour (3600 seconds)
    }
}, { 
    // Disable automatic timestamps since we manually control createdAt and expiresAt
    timestamps: false 
});

module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);