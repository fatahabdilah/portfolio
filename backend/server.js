// backend/server.js
require("dotenv").config();

// 1. Import core libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");
// REMOVED: require("swagger-ui-dist"); (Tidak diperlukan karena menggunakan CDN)


// --- PRO ENHANCEMENT: LOAD ALL MODELS EARLY ---
require("./models/UserModel"); 
require("./models/ProjectModel"); 
require("./models/TechnologyModel"); 
require("./models/PasswordResetTokenModel"); 


// Import Routes
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const technologyRoutes = require("./routes/technologyRoutes"); 

// Initialize the Express application
const app = express();

// Set environment variables for portability
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// -------------------------------------------------------------
// | 2. MIDDLEWARE CONFIGURATION                |
// -------------------------------------------------------------
const allowedOrigin = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());

// -------------------------------------------------------------
// | 3. SWAGGER DOCUMENTATION SETUP (USING CDN)                |
// -------------------------------------------------------------

// CDN URL untuk aset Swagger (gunakan versi stabil)
// Karena Anda menggunakan swagger-ui-express versi 5.x, kita akan menggunakan CDN yang sesuai.
const CDN_URL_PREFIX = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.30.1";


// REMOVED: app.use(swaggerUiAssetPath, express.static(...))

app.use("/docs", swaggerUi.serve, (req, res) => {
  // Buat salinan dokumen untuk setiap permintaan.
  const swaggerDoc = JSON.parse(JSON.stringify(swaggerDocument));

  // Tentukan URL server dinamis.
  const serverUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL 
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
    : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}` 
        : `http://localhost:${PORT}`;
  swaggerDoc.servers = [{ url: serverUrl }];

  // 💡 Konfigurasi CDN: Gunakan URL dari CDN untuk memuat aset utama.
  const swaggerUiOptions = {
    // Tentukan URL CDN untuk file CSS utama
    customCssUrl: `${CDN_URL_PREFIX}/swagger-ui.css`,
    // Tentukan URL CDN untuk file JavaScript utama
    customJs: `${CDN_URL_PREFIX}/swagger-ui-bundle.js`,
    // Tentukan URL CDN untuk file JavaScript tambahan (jika ada)
    customJsFavicon: `${CDN_URL_PREFIX}/favicon-32x32.png`,
    
    // Konfigurasi ini memberitahu Swagger UI untuk memuat asetnya dari URL eksternal
    // daripada dari folder lokal yang dilayani Express.
    swaggerOptions: {
        // Jika Anda perlu memuat file YAML/JSON eksternal (bukan yang disajikan Express)
        // url: 'https://petstore.swagger.io/v2/swagger.json'
    }
  };

  const ui = swaggerUi.setup(swaggerDoc, swaggerUiOptions);
  ui(req, res);
});

// -------------------------------------------------------------
// | 4. ROUTE DEFINITIONS                                      |
// -------------------------------------------------------------

/**
 * @route GET /
 * @desc Professional API root response.
 * @access Public
 */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the My-Portfolio REST API.",
    documentation: "/docs",
    version: "1.0.0",
    developer: "Fatah Abdilah",
  });
});

// Primary API Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/technologies", technologyRoutes); 

// -------------------------------------------------------------
// | 5. DATABASE CONNECTION & SERVER INITIALIZATION            |
// -------------------------------------------------------------

const connectDBAndStartServer = async () => {
  if (!mongoose.connection.readyState) {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000, 
      });
      console.log("✅ MongoDB connected successfully!");
    } catch (err) {
      console.error("❌ CONNECTION FAILED:", err.message);
      if (process.env.NODE_ENV !== "production") {
        process.exit(1);
      }
    }
  }

  if (
    process.env.NODE_ENV !== "test" &&
    process.env.VERCEL_ENV !== "production"
  ) {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }
};

connectDBAndStartServer();

// Export the Express app instance. 
module.exports = app;