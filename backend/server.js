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

// Import Routes
const userRoutes = require("./routes/userRoutes"); 
const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");
console.log("[DEBUG] 2. Core libraries and routes imported.");

// Initialize the Express application
const app = express();

// Set environment variables for portability
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// -------------------------------------------------------------
// | 3. MIDDLEWARE CONFIGURATION                               |
// -------------------------------------------------------------
console.log("[DEBUG] 3. Starting middleware configuration.");
const allowedOrigin = process.env.FRONTEND_URL;
console.log(`[DEBUG] CORS allowed origin set to: ${allowedOrigin}`);

app.use(cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use(express.json());


// -------------------------------------------------------------
// | 4. SWAGGER DOCUMENTATION SETUP (Debugging Paths)          |
// -------------------------------------------------------------

// Log the directory name where server.js is located
const serverDir = __dirname;
console.log(`[DEBUG] __dirname (Server directory): ${serverDir}`);

// Construct the full path to the YAML file
const yamlPath = path.join(serverDir, 'config', 'swagger.yaml');
console.log(`[DEBUG] Full YAML path calculated: ${yamlPath}`);

try {
    // Load the documentation file reliably using absolute path 
    const swaggerDocument = YAML.load(yamlPath);
    console.log("[DEBUG] YAML file loaded successfully.");
    
    // Add the JSON endpoint for the Swagger definition (crucial for stability)
    app.get('/api-docs-json', (req, res) => {
        console.log("[DEBUG] /api-docs-json endpoint hit.");
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerDocument);
    });

    // Mount the Swagger UI on a dedicated route
    app.use('/docs', 
      swaggerUi.serve, 
      swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            url: "/api-docs-json" 
        },
      })
    );
    console.log("[DEBUG] Swagger UI setup complete on /docs.");
    
} catch (error) {
    console.error(`[DEBUG CRITICAL ERROR] Failed to load or set up Swagger: ${error.message}`);
    // Jika ada error di sini, Vercel mungkin mengeluarkan error 500.
}


// -------------------------------------------------------------
// | 5. ROUTE DEFINITIONS                                      |
// -------------------------------------------------------------
console.log("[DEBUG] 5. Route definitions set.");
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
console.log("[DEBUG] 6. Starting DB connection setup.");
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
console.log("[DEBUG] connectDBAndStartServer initiated.");

// Export the Express app instance.
module.exports = app; 
console.log("[DEBUG] module.exports = app completed.");