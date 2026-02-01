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
const technologyRoutes = require("./routes/technologyRoutes");
const blogRoutes = require("./routes/blogRoutes");

// Initialize the Express application
const app = express();

// Set environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// -------------------------------------------------------------
// | 2. MIDDLEWARE CONFIGURATION                               |
// -------------------------------------------------------------

// FIX CORS: Menggunakan fungsi origin dinamis karena credentials: true
// Ini memastikan origin yang meminta akan langsung diizinkan jika diperbolehkan
const allowedOrigins = [
  "https://fatahabdilah.site",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    // Izinkan jika origin ada di daftar atau jika request bersifat lokal (tanpa origin, misal: Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS debug"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// -------------------------------------------------------------
// | 3. SWAGGER DOCUMENTATION SETUP                            |
// -------------------------------------------------------------

const swaggerUiAssetPath = "/docs-assets";

app.use(
  swaggerUiAssetPath,
  express.static(path.join(__dirname, "public", "docs-assets"))
);

app.use("/docs", swaggerUi.serve, (req, res) => {
  const swaggerDoc = JSON.parse(JSON.stringify(swaggerDocument));
  const serverUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL 
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
    : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}` 
        : `http://localhost:${PORT}`;
  swaggerDoc.servers = [{ url: serverUrl }];

  const swaggerUiOptions = {
    customCssUrl: `${swaggerUiAssetPath}/swagger-ui.css`,
  };

  const ui = swaggerUi.setup(swaggerDoc, swaggerUiOptions);
  ui(req, res);
});

// -------------------------------------------------------------
// | 4. ROUTE DEFINITIONS                                      |
// -------------------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the My-Portfolio REST API.",
    documentation: "/docs",
    version: "1.0.0",
    developer: "Fatah Abdilah",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/technologies", technologyRoutes); 
app.use("/api/blogs", blogRoutes);

// -------------------------------------------------------------
// | 5. DATABASE CONNECTION & SERVER INITIALIZATION            |
// -------------------------------------------------------------

const connectDBAndStartServer = async () => {
  require("./models/UserModel"); 
  require("./models/ProjectModel");
  require("./models/TechnologyModel"); 
  require("./models/PasswordResetTokenModel"); 
  require("./models/BlogModel");

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

module.exports = app;