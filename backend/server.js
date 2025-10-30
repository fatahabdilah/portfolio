// backend/server.js

// 1. Load environment variables immediately
require("dotenv").config();

// 2. Import core libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const swaggerUi = require('swagger-ui-express'); 
const YAML = require('yamljs'); 

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
// | 4. SWAGGER DOCUMENTATION SETUP (Using Absolute Path)      |
// -------------------------------------------------------------

// Load the documentation file reliably using absolute path 
// (Necessary for Vercel/Serverless to find the file correctly)
const swaggerDocument = YAML.load(
    path.join(__dirname, 'config', 'swagger.yaml')
);
// Mount the Swagger UI on a dedicated route
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
// | 6. DATABASE CONNECTION & SERVER INITIALIZATION (Vercel Fix) |
// -------------------------------------------------------------

/**
 * @desc Attempts to connect to MongoDB.
 * The server listener logic (app.listen) is REMOVED for Vercel deployment.
 * For local development, we manually call app.listen if MONGO_URI is set.
 */
const connectDBAndStartServer = async () => {
    // 1. Attempt Connection
    if (!mongoose.connection.readyState) {
        try {
            await mongoose.connect(MONGO_URI);
            console.log("✅ MongoDB connected successfully!");
        } catch (err) {
            console.error("❌ CONNECTION FAILED:", err.message);
            // In Vercel, we shouldn't exit the process here, but log the error.
            if (process.env.NODE_ENV !== "production") { 
                process.exit(1); 
            }
            // For production, the function will still return the 'app' but DB operations will fail.
        }
    }

    // 2. Start Express server ONLY if not in a test or Vercel environment
    // We check if the environment supports standard listening (local dev).
    if (process.env.NODE_ENV !== "test" && process.env.VERCEL_ENV !== "production") {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log("-------------------------------------------");
        });
    }
};

// Initiate connection only. Do NOT await it, as Vercel needs the 'app' instance immediately.
connectDBAndStartServer();

// Export the Express app instance. Vercel will use this exported app instance 
// as the handler for incoming requests, removing the need for app.listen().
module.exports = app;