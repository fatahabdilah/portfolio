// backend/routes/userRoutes.js

const express = require("express");
const { 
    loginUser, 
    forgotPassword, 
    resetPassword,
    // registerUser, // Left commented out for clarity
} = require("../controllers/UserController");
const requireAuth = require("../middleware/requireAuth"); 

const router = express.Router();

// --- PUBLIC AUTH ROUTES ---

/**
 * @route POST /api/users/login
 * @desc Authenticate user and issue JWT.
 * @access Public
 */
router.post("/login", loginUser);

/**
 * @route POST /api/users/forgot-password
 * @desc Initiate password reset process.
 * @access Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route PUT /api/users/resetpassword/:token
 * @desc Reset user's password using the generated token.
 * @access Public
 */
router.put("/resetpassword/:token", resetPassword);


// --- PRIVATE ROUTES ---

/**
 * @route GET /api/users/profile
 * @desc Fetches the authenticated user's profile (JWT test).
 * @access Private
 */
router.get("/profile", requireAuth, (req, res) => {
  res.status(200).json({
    message: "Secret access granted! Profile data retrieved.",
    userId: req.user._id,
  });
});

module.exports = router;