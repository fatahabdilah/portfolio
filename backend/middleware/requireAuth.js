const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// Ensure environment variables (like SECRET) are loaded, 
// though typically done in server.js, this provides added reliability.
require("dotenv").config();

/**
 * @desc Middleware to verify JWT and authenticate the user.
 * It checks for the token in the Authorization header, verifies it,
 * and attaches the user's ID to the request object (req.user).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function to proceed to the controller.
 * @access Private
 */
const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  // 1. Check if token exists
  if (!authorization) {
    return res.status(401).json({ error: "Authentication token required" });
  }

  // Expects format: "Bearer <token>"
  const token = authorization.split(" ")[1];

  try {
    // 2. Verify the token using the SECRET key
    const { _id } = jwt.verify(token, process.env.SECRET);
    
    // 3. Find the user and attach only the ID to the request
    req.user = await User.findOne({ _id }).select("_id");

    // Proceed to the next middleware/controller
    next();
  } catch (error) {
    // 4. Handle verification failure (e.g., token expired, invalid signature)
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ error: "Request is unauthorized" });
  }
};

module.exports = requireAuth;