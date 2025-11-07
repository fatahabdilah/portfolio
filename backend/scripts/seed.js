// backend/scripts/seed.js

// Load environment variables immediately
require("dotenv").config(); 
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel"); // Import User Model

// --- Configuration (Pulling credentials from .env) ---
// Note: This prevents hardcoding sensitive data directly into the script.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@myportfolio.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!"; // Fallback for safety
const ADMIN_NAME = process.env.ADMIN_NAME || "Default Administrator";

/**
 * @desc Seeds the database with the initial Admin user account.
 * Clears existing users to ensure a clean state for the seed operation.
 */
const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected. Starting seed...");

        // Delete all existing users
        await User.deleteMany({});
        console.log("Existing users cleared.");

        // Hash the admin password for secure storage
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        // Create the new Admin user
        await User.create({
            email: ADMIN_EMAIL,
            password: hashedPassword,
            name: ADMIN_NAME,
            role: "admin", // Explicitly set role
        });

        console.log(`✅ Admin user created: ${ADMIN_EMAIL} with role: admin`);
        
    } catch (error) {
        console.error("❌ SEEDING FAILED:", error.message);
        
    } finally {
        // Ensure the database connection is closed gracefully
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
};

seedDB();  