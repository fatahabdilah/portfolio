// backend/server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");
require("swagger-ui-dist");

const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const technologyRoutes = require("./routes/technologyRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- CONFIGURASI CORS DENGAN DETEKSI ORIGIN DINAMIS ---
const allowedOrigins = [
  "https://fatahabdilah.site",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    // Izinkan request tanpa origin (seperti Postman atau mobile)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Origin diizinkan
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS logic"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// --- SWAGGER SETUP ---
const swaggerUiAssetPath = "/docs-assets";
app.use(swaggerUiAssetPath, express.static(path.join(__dirname, "public", "docs-assets")));
app.use("/docs", swaggerUi.serve, (req, res) => {
  const swaggerDoc = JSON.parse(JSON.stringify(swaggerDocument));
  const serverUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL 
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
    : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${PORT}`;
  swaggerDoc.servers = [{ url: serverUrl }];
  const ui = swaggerUi.setup(swaggerDoc, { customCssUrl: `${swaggerUiAssetPath}/swagger-ui.css` });
  ui(req, res);
});

// --- API ROUTES ---
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "My-Portfolio REST API", documentation: "/docs" });
});
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/technologies", technologyRoutes); 
app.use("/api/blogs", blogRoutes);

// --- DATABASE & SERVER ---
const connectDBAndStartServer = async () => {
  require("./models/UserModel"); require("./models/ProjectModel");
  require("./models/TechnologyModel"); require("./models/BlogModel");

  if (!mongoose.connection.readyState) {
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
      console.log("✅ MongoDB Connected");
    } catch (err) {
      console.error("❌ DB FAILED:", err.message);
      if (process.env.NODE_ENV !== "production") process.exit(1);
    }
  }

  if (process.env.NODE_ENV !== "test" && process.env.VERCEL_ENV !== "production") {
    app.listen(PORT, () => console.log(`🚀 Running: http://localhost:${PORT}`));
  }
};
connectDBAndStartServer();

module.exports = app;