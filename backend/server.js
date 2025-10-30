// backend/server.js

// 1. Load environment variables immediately
require("dotenv").config();
console.log("[DEBUG R-100] 1. Environment variables loaded.");

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
console.log("[DEBUG R-110] 2. Core libraries and routes imported. Express instance created.");

// Initialize the Express application
const app = express();

// Set environment variables for portability
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// -------------------------------------------------------------
// | 3. MIDDLEWARE CONFIGURATION                               |
// -------------------------------------------------------------
console.log("[DEBUG R-120] 3. Starting middleware configuration (CORS/JSON).");
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use(express.json());
console.log("[DEBUG R-130] Middleware setup complete.");


// -------------------------------------------------------------
// | 4. SWAGGER DOCUMENTATION SETUP (Absolute URL Fix)         |
// -------------------------------------------------------------

const serverDir = __dirname;
const yamlPath = path.join(serverDir, 'config', 'swagger.yaml');

try {
    console.log(`[DEBUG R-140] Attempting to load YAML from: ${yamlPath}`);
    const swaggerDocument = YAML.load(yamlPath);
    console.log("[DEBUG R-150] YAML file loaded successfully. Definition found.");
    
    // Tentukan URL HOST dinamis untuk lingkungan Vercel
    const IS_PROD = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
    
    // VERCEL_URL adalah variabel lingkungan yang disediakan Vercel
    const VERCEL_HOST = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${PORT}`;
    
    // URL yang akan dipanggil oleh Swagger JS:
    const finalSwaggerUrl = `${VERCEL_HOST}/api-docs-json`;
    console.log(`[DEBUG R-155] Final Swagger Definition URL set to: ${finalSwaggerUrl}`);


    // 1. Add the JSON endpoint for the Swagger definition
    app.get('/api-docs-json', (req, res) => {
        console.log("[DEBUG R-160] API DEFINITION HIT: /api-docs-json served.");
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerDocument);
    });

    // 2. Mount the Swagger UI on a dedicated route
    app.use('/docs', 
      (req, res, next) => {
          // Log permintaan /docs secara spesifik untuk debugging
          console.log(`[DEBUG R-171] Incoming request to /docs path: ${req.path}`);
          next();
      },
      swaggerUi.serve, 
      swaggerUi.setup(null, { 
        // Menggunakan URL absolut yang memaksa browser untuk memanggil host yang benar
        swaggerUrl: finalSwaggerUrl, 
        explorer: true,
      })
    );
    console.log("[DEBUG R-170] Swagger UI mounted on /docs.");
    
} catch (error) {
    console.error(`[DEBUG R-180 CRITICAL ERROR] Failed to load or set up Swagger: ${error.message}`);
}


// -------------------------------------------------------------
// | 5. ROUTE DEFINITIONS                                      |
// -------------------------------------------------------------
console.log("[DEBUG R-190] 5. Setting up primary API routes.");
/**
 * @route GET /
 * @desc Root testing route to confirm server status.
 * @access Public
 */
app.get("/", (req, res) => {
    console.log("[DEBUG R-200] Root route (/) hit.");
    res.send("Server My-Portfolio running! Ready to connect to DB.");
});

// Primary API Routes
app.use("/api/users", userRoutes); 
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
console.log("[DEBUG R-210] All routes successfully attached to Express instance.");


// -------------------------------------------------------------
// | 6. DATABASE CONNECTION & SERVER INITIALIZATION (Vercel Fix) |
// -------------------------------------------------------------
console.log("[DEBUG R-220] 6. Starting DB connection setup.");
const connectDBAndStartServer = async () => {
    // 1. Attempt Connection
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

    // 2. Start Express server ONLY if not in a test or Vercel environment
    if (process.env.NODE_ENV !== "test" && process.env.VERCEL_ENV !== "production") {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log("-------------------------------------------");
        });
    }
};

// Initiate connection only.
connectDBAndStartServer();
console.log("[DEBUG R-230] connectDBAndStartServer initiated (Async).");

// Export the Express app instance.
module.exports = app; 
console.log("[DEBUG R-240] module.exports = app completed.");