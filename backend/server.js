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
// | 3. MIDDLEWARE CONFIGURATION                               |
// -------------------------------------------------------------
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use(express.json());


// -------------------------------------------------------------
// | 4. SWAGGER DOCUMENTATION SETUP (Explicit Configuration)   |
// -------------------------------------------------------------

// Load the documentation file reliably using absolute path 
const swaggerDocument = YAML.load(
    path.join(__dirname, 'config', 'swagger.yaml')
);

// Mount the Swagger UI on a dedicated route
// Gunakan konfigurasi eksplisit untuk menghindari masalah caching di browser
app.use('/docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument, {
    // Menambahkan opsi ini terkadang membantu di lingkungan proxy/serverless
    swaggerOptions: {
        url: "/api-docs-json" // Path virtual ke definisi JSON
    },
    // Pastikan server tidak mencoba memuat file statis yang salah
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css',
    customJsUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.js'
  })
);

// Tambahkan rute untuk melayani definisi JSON Swagger
// Ini memberikan endpoint yang jelas bagi Swagger UI untuk memuat data.
app.get('/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
});

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