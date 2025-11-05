// backend/server.js
require("dotenv").config();

// 1. Import core libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");
require("swagger-ui-dist");

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
// | 2. MIDDLEWARE CONFIGURATION                               |
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
// | 3. SWAGGER DOCUMENTATION SETUP                            |
// -------------------------------------------------------------

// Definisikan path untuk aset statis Swagger.
const swaggerUiAssetPath = "/docs-assets";

// Sajikan direktori 'public' yang berisi aset Swagger yang sudah disalin.
app.use(
  swaggerUiAssetPath,
  express.static(path.join(__dirname, "public", "docs-assets"))
);

app.use("/docs", swaggerUi.serve, (req, res) => {
  // Buat salinan dokumen untuk setiap permintaan agar aman dari modifikasi.
  const swaggerDoc = JSON.parse(JSON.stringify(swaggerDocument));

  // Tentukan URL server dinamis.
  const serverUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${PORT}`;
  swaggerDoc.servers = [{ url: serverUrl }];

  // Beri tahu Swagger UI di mana menemukan aset statisnya.
  const swaggerUiOptions = {
    customCssUrl: `${swaggerUiAssetPath}/swagger-ui.css`,
  };

  const ui = swaggerUi.setup(swaggerDoc, swaggerUiOptions);
  ui(req, res);
});

// -------------------------------------------------------------
// | 4. ROUTE DEFINITIONS                                      |
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
app.use("/api/skills", skillRoutes);

// -------------------------------------------------------------
// | 5. DATABASE CONNECTION & SERVER INITIALIZATION            |
// -------------------------------------------------------------

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