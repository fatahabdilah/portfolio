// backend/server.js

// 1. Load environment variables immediately
require("dotenv").config();

// 2. Import core libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express'); // Swagger UI Library
const YAML = require('yamljs'); // YAML Parser for documentation file

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

// --- CORS Configuration ---
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

// Body Parser: Allows Express to read JSON data sent by clients
app.use(express.json());

// -------------------------------------------------------------
// | 4. SWAGGER DOCUMENTATION SETUP (New Section)              |
// -------------------------------------------------------------

// Load the documentation file
const swaggerDocument = YAML.load('./config/swagger.yaml');

// Mount the Swagger UI on a dedicated route
// Documentation will be accessible at: http://localhost:[PORT]/docs
app.use('/docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

console.log(`📚 Documentation available at /docs`);

// -------------------------------------------------------------
// | 5. ROUTE DEFINITIONS                                      |
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
// | 6. DATABASE CONNECTION & SERVER INITIALIZATION            |
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