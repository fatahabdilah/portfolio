// backend/routes/userRoutes.js

const express = require("express");
const {
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile, // Import the new controller function
} = require("../controllers/UserController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// --- PUBLIC AUTH ROUTES ---

/**
 * @route POST /api/users/login
 * @desc Authenticate user credentials and issue a JWT token for subsequent private API access.
 * @access Public
 * @body {string} email - The user's login email address.
 * @body {string} password - The user's password.
 * @returns {object} 200 - { email, name, token: <JWT> }
 * @returns {object} 400 - { error: "Incorrect email or password" }
 */
router.post("/login", loginUser);

/**
 * @route POST /api/users/forgot-password
 * @desc Initiates the password reset flow. Requires an email and sends a reset link if the user exists.
 * @access Public
 * @body {string} email - The email address associated with the account.
 * @returns {object} 200 - { message: "Password reset link sent to your email." } (Note: Always returns 200 for security, even if email is not found).
 * @returns {object} 500 - { error: "Failed to send reset email." }
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route PATCH /api/users/resetpassword/:token
 * @desc Finalizes the password reset. Resets user's password using the generated token from the email link.
 * @access Public
 * @param {string} token - The unique password reset token found in the URL.
 * @body {string} password - The new password for the user.
 * @returns {object} 200 - { message: "Password has been successfully reset" }
 * @returns {object} 400 - { error: "Password reset token is invalid or has expired." }
 */
router.patch("/resetpassword/:token", resetPassword);

// --- PRIVATE ROUTES ---

/**
 * @route GET /api/users/profile
 * @desc Fetches the authenticated user's profile data. Requires a valid JWT in the Authorization header.
 * @access Private
 * @header {string} Authorization - Bearer <JWT Token>
 * @returns {object} 200 - { message: "...", userId: <ObjectID> }
 * @returns {object} 401 - { error: "Authentication token required" }
 */
// Use the dedicated controller function
router.get("/profile", requireAuth, getProfile); 

module.exports = router;