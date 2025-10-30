// backend/server.js

// 1. Load environment variables immediately
require("dotenv").config();
console.log("[DEBUG] 1. Environment variables loaded.");

// 2. Import core libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const swaggerUi = require('swagger-ui-express'); 
const YAML = require('yamljs'); 
const fs = require('fs'); 
console.log("[DEBUG] 2. Core libraries imported.");

// Import Routes
const userRoutes = require("./routes/userRoutes"); 
const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");
console.log("[DEBUG] 3. Routes imported.");

// Initialize the Express application
const app = express();
console.log("[DEBUG] 4. Express app initialized.");

// Set environment variables for portability
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// -------------------------------------------------------------
// | 3. MIDDLEWARE CONFIGURATION                               |
// -------------------------------------------------------------
console.log("[DEBUG] 5. Configuring middleware.");
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use(express.json());
console.log("[DEBUG] 6. Middleware configured.");


// -------------------------------------------------------------
// | 4. SWAGGER DOCUMENTATION SETUP (Universal)                |
// -------------------------------------------------------------
console.log("[DEBUG] 7. Setting up Swagger documentation.");
const yamlPath = path.join(__dirname, 'config', 'swagger.yaml');
console.log(`[DEBUG] 8. YAML path: ${yamlPath}`);
const swaggerDocument = YAML.parse(fs.readFileSync(yamlPath, 'utf8'));
console.log("[DEBUG] 9. Swagger document loaded and parsed.");

app.use('/docs', (req, res, next) => {
    console.log(`[DEBUG] 10. Request to /docs received. URL: ${req.originalUrl}`);
    next();
}, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log("[DEBUG] 11. Swagger UI middleware configured.");


// -------------------------------------------------------------
// | 5. ROUTE DEFINITIONS                                      |
// -------------------------------------------------------------
console.log("[DEBUG] 12. Setting up route definitions.");
/**
 * @route GET /
 * @desc Root testing route to confirm server status.
 * @access Public
 */
app.get("/", (req, res) => {
  console.log("[DEBUG] 13. Root route (/) hit.");
  res.send("Server My-Portfolio running! Ready to connect to DB. Swagger documentation is at /docs");
});

// Primary API Routes
app.use("/api/users", userRoutes); 
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
console.log("[DEBUG] 14. API routes configured.");


// -------------------------------------------------------------
// | 6. DATABASE CONNECTION & SERVER INITIALIZATION            |
// -------------------------------------------------------------
console.log("[DEBUG] 15. Setting up database connection.");
const connectDBAndStartServer = async () => {
    if (!mongoose.connection.readyState) {
        try {
            await mongoose.connect(MONGO_URI);
            console.log("✅ MongoDB connected successfully!");
        } catch (err) {
            console.error("❌ CONNECTION FAILED:", err.message);
            if (process.env.NODE_ENV !== "production") { 
                process.exit(1); 
            }
        }
    }

    if (process.env.NODE_ENV !== "test" && process.env.VERCEL_ENV !== "production") {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
};

connectDBAndStartServer();
console.log("[DEBUG] 16. Database connection initiated.");

// Export the Express app instance.
module.exports = app;
console.log("[DEBUG] 17. Express app exported.");