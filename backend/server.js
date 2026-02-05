// backend/server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");

const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const technologyRoutes = require("./routes/technologyRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- OPTIMASI KONEKSI DATABASE (Pola Singleton untuk Vercel) ---
// Simpan koneksi di tingkat global agar tidak membuat koneksi baru setiap request
let cachedDb = global.mongoose;

if (!cachedDb) {
  cachedDb = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Jika koneksi sudah ada, gunakan yang tersedia
  if (cachedDb.conn) {
    return cachedDb.conn;
  }

  if (!cachedDb.promise) {
    const opts = {
      bufferCommands: false, // PENTING: Matikan buffering agar tidak timeout saat koneksi tertunda
      serverSelectionTimeoutMS: 5000, // Timeout lebih cepat (5 detik)
    };

    cachedDb.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected");
      return mongoose;
    });
  }

  try {
    cachedDb.conn = await cachedDb.promise;
  } catch (e) {
    cachedDb.promise = null;
    throw e;
  }

  return cachedDb.conn;
};

// Middleware untuk memastikan DB terhubung sebelum memproses rute apapun
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ DB CONNECTION ERROR:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// --- CONFIGURASI CORS ---
const allowedOrigins = [
  "https://fatahabdilah.site",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
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
    : `http://localhost:${PORT}`;
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

// Import Models untuk inisialisasi schema
require("./models/UserModel"); 
require("./models/ProjectModel");
require("./models/TechnologyModel"); 
require("./models/BlogModel");

// Menjalankan server lokal (hanya jika bukan di lingkungan Vercel)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Running: http://localhost:${PORT}`));
}

module.exports = app;