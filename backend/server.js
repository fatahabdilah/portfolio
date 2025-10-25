// backend/server.js

// 1. Load environment variables immediately
require("dotenv").config();

// 2. Import core libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const userRoutes = require("./routes/userRoutes"); 
const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");


// Initialize the Express application
const app = express();

// Set environment variables for portability
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// -------------------------------------------------------------
// | 3. MIDDLEWARE CONFIGURATION                               |
// -------------------------------------------------------------

// Enable CORS (Cross-Origin Resource Sharing) for development
app.use(cors());

// Body Parser: Allows Express to read JSON data sent by clients
app.use(express.json());

// -------------------------------------------------------------
// | 4. ROUTE DEFINITIONS                                      |
// -------------------------------------------------------------

/**
 * @route GET /
 * @desc Root testing route to confirm server status.
 * @access Public
 */
app.get("/", (req, res) => {
  res.send("Server My-Portfolio running! Ready to connect to DB.");
});

// Primary API Routes
app.use("/api/users", userRoutes); 
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);


// -------------------------------------------------------------
// | 5. DATABASE CONNECTION & SERVER INITIALIZATION            |
// -------------------------------------------------------------

/**
 * @desc Attempts to connect to MongoDB and starts the Express server upon success.
 */
const connectDB = async () => {
  try {
    // Attempt connection
    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected successfully!");

    // Start Express server only after DB connection is successful
    // Only listen if not in a testing environment (prevents address in use error during tests)
    if (process.env.NODE_ENV !== "test") { 
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log("-------------------------------------------");
        });
    }

  } catch (err) {
    // Log failure and exit process
    console.error("❌ CONNECTION FAILED:", err.message);
    process.exit(1);
  }
};

// Initiate connection and server start
connectDB();

// Export the Express app instance for unit testing (Supertest/Jest)
module.exports = app;