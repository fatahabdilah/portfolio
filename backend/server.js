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

// ... (Bagian 3. MIDDLEWARE CONFIGURATION sama) ...
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// -------------------------------------------------------------
// | 4. SWAGGER DOCUMENTATION SETUP (Cleaned Configuration)    |
// -------------------------------------------------------------

// Load the documentation file reliably using absolute path 
const swaggerDocument = YAML.load(
    path.join(__dirname, 'config', 'swagger.yaml')
);

// Add the JSON endpoint for the Swagger definition (crucial for stability)
app.get('/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
});

// Mount the Swagger UI on a dedicated route
// Hapus opsi customCssUrl dan customJsUrl untuk menggunakan asset bawaan paket.
app.use('/docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
        url: "/api-docs-json" // Path virtual yang dieksplisitkan
    },
    // Opsi ini harusnya dihilangkan, membiarkan paket yang menanganinya:
    // customCssUrl: '...', 
    // customJsUrl: '...', 
  })
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

// Export the Express app instance.
module.exports = app;