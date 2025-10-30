// backend/server.js

// 1. Load environment variables immediately
require("dotenv").config();

// 2. Import core libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");

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
// | 4. SWAGGER DOCUMENTATION SETUP                            |
// -------------------------------------------------------------
// Di lingkungan serverless seperti Vercel, lebih andal untuk menyajikan swagger.json
// secara langsung daripada melalui URL terpisah untuk menghindari masalah routing.
// swaggerDocument diimpor dari file JSON dan langsung diteruskan ke setup.
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// -------------------------------------------------------------
// | 5. ROUTE DEFINITIONS                                      |
// -------------------------------------------------------------

/**
 * @route GET /
 * @desc Root testing route to confirm server status.
 * @access Public
 */
app.get("/", (req, res) => {
  res.send(
    "Server My-Portfolio running! Ready to connect to DB. Swagger documentation is at /docs"
  );
});

// Primary API Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);

// -------------------------------------------------------------
// | 6. DATABASE CONNECTION & SERVER INITIALIZATION            |
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
