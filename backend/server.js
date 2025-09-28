// 1. Memuat variabel lingkungan (.env)
require("dotenv").config();

// 2. Mengimpor library yang dibutuhkan
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Inisialisasi aplikasi Express
const app = express();

// Mengambil URI dan PORT dari file .env
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ---------------------------------
// | 3. MIDDLEWARE                 |
// ---------------------------------
// A. Mengizinkan CORS (Semua Origin untuk Development)
app.use(cors());

// B. Body Parser: Memungkinkan Express membaca data JSON dari client
app.use(express.json());

// ---------------------------------
// | 4. ROUTES (Tempatkan di sini) |
// ---------------------------------
app.get("/", (req, res) => {
  res.send("Server My-Portfolio berjalan! Siap terhubung ke DB.");
});

// -----------------------------------
// | 5. KONEKSI DATABASE & SERVER START |
// -----------------------------------
const connectDB = async () => {
  try {
    // Mencoba menghubungkan ke MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully!");

    // Menjalankan server Express hanya setelah koneksi DB sukses
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log("-------------------------------------------");
    });
  } catch (err) {
    console.error("❌ CONNECTION FAILED:", err.message);
    // Keluar dari proses jika koneksi gagal
    process.exit(1);
  }
};

// Panggil fungsi untuk memulai koneksi dan server
connectDB();
