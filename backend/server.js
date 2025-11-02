// backend/server.js

/**
 * @file server.js
 * @description File utama untuk backend aplikasi portfolio.
 *              File ini menginisialisasi server Express, menghubungkan ke database MongoDB,
 *              mengkonfigurasi middleware, mendefinisikan rute API, dan mengatur dokumentasi Swagger.
 *              Dirancang untuk bisa di-deploy di lingkungan serverless seperti Vercel.
 */

// =================================================================
// 1. MEMUAT VARIABEL LINGKUNGAN (ENVIRONMENT VARIABLES)
// =================================================================
// Menggunakan 'dotenv' untuk memuat variabel dari file .env ke dalam 'process.env'.
// Ini harus dilakukan paling awal agar semua variabel tersedia untuk modul lain.
require("dotenv").config();

// =================================================================
// 2. MENGIMPOR LIBRARY DAN MODUL INTI
// =================================================================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");

// Impor Rute (Routes)
// Memisahkan logika rute ke dalam file-file terpisah untuk menjaga kerapian kode.
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");

// Inisialisasi aplikasi Express.
// 'app' adalah objek utama yang merepresentasikan server web kita.
const app = express();

// Mengatur variabel dari environment untuk portabilitas.
// PORT: Port tempat server akan berjalan. Menggunakan process.env.PORT agar fleksibel saat di-deploy,
//       dengan fallback ke 5000 untuk pengembangan lokal.
// MONGO_URI: Connection string untuk database MongoDB, diambil dari file .env.
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// -------------------------------------------------------------
// | 3. MIDDLEWARE CONFIGURATION                               |
// -------------------------------------------------------------
const allowedOrigin = process.env.FRONTEND_URL;

// Mengaktifkan Cross-Origin Resource Sharing (CORS).
// Ini penting agar frontend yang berjalan di domain berbeda (misal, di Vercel)
// dapat membuat permintaan API ke backend ini.
app.use(
  cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Middleware untuk mem-parsing body permintaan dalam format JSON.
// Ini memungkinkan kita mengakses data yang dikirim dari klien melalui `req.body`.
app.use(express.json());

// -------------------------------------------------------------
// | 4. SWAGGER DOCUMENTATION SETUP                            |
// -------------------------------------------------------------
// Bagian ini sangat penting untuk memastikan Swagger UI berfungsi dengan baik di Vercel.
// Masalah umum di Vercel adalah file aset (CSS, JS) Swagger tidak dapat dimuat
// karena Vercel tidak menyajikan file dari `node_modules` secara default.
// Solusinya adalah menyalin aset tersebut ke direktori `public` saat build,
// lalu menyajikannya secara statis menggunakan Express.

// Definisikan path URL kustom untuk aset statis Swagger.
// Ini akan menjadi prefix URL untuk mengakses file-file seperti CSS dan JS Swagger.
const swaggerUiAssetPath = "/docs-assets";

// Sajikan direktori 'public/docs-assets' sebagai file statis.
// `express.static` adalah middleware bawaan Express untuk menyajikan file statis.
// `path.join` digunakan untuk membuat path yang kompatibel di berbagai sistem operasi.
// Ketika ada permintaan ke `/docs-assets/swagger-ui.css`, Express akan mencarinya di
// `[direktori_proyek]/public/docs-assets/swagger-ui.css`.
app.use(
  swaggerUiAssetPath,
  express.static(path.join(__dirname, "public", "docs-assets"))
);

// Mengatur rute utama untuk dokumentasi Swagger di `/docs`.
// `swaggerUi.serve` adalah middleware pertama yang menyiapkan UI.
// Middleware kedua adalah fungsi kustom kita untuk mengkonfigurasi UI secara dinamis.
app.use("/docs", swaggerUi.serve, (req, res) => {
  // 1. Membuat salinan dokumen Swagger untuk setiap permintaan.
  // Ini adalah praktik yang baik untuk mencegah modifikasi pada objek `swaggerDocument` asli
  // yang di-cache oleh Node.js, yang bisa menyebabkan masalah state antar permintaan.
  const swaggerDoc = JSON.parse(JSON.stringify(swaggerDocument));

  // 2. Menentukan URL server API secara dinamis.
  // Saat di-deploy di Vercel, `process.env.VERCEL_URL` akan berisi URL deployment.
  // Jika tidak, kita asumsikan sedang berjalan di lokal.
  // Ini memastikan bahwa tombol "Try it out" di Swagger akan mengirim permintaan ke server yang benar.
  const serverUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${PORT}`;
  swaggerDoc.servers = [{ url: serverUrl }];

  // 3. Memberi tahu Swagger UI di mana menemukan file CSS kustomnya.
  // Ini adalah langkah KUNCI untuk memperbaiki tampilan UI yang berantakan di Vercel.
  // Kita secara eksplisit memberitahu Swagger untuk memuat CSS dari path yang sudah kita sajikan secara statis.
  const swaggerUiOptions = {
    customCssUrl: `${swaggerUiAssetPath}/swagger-ui.css`,
  };

  // 4. Merender halaman Swagger UI.
  // `swaggerUi.setup` menghasilkan fungsi yang akan merender HTML lengkap untuk UI Swagger.
  // Kita memanggil fungsi ini dengan `req` dan `res` untuk mengirimkan halaman ke browser.
  const ui = swaggerUi.setup(swaggerDoc, swaggerUiOptions);
  ui(req, res);
});

// -------------------------------------------------------------
// | 5. ROUTE DEFINITIONS                                      |
// -------------------------------------------------------------

/**
 * @route GET /
 * @desc Root testing route to confirm server status.
 * @access Public
 */
// Rute dasar untuk memeriksa apakah server berjalan dengan baik (health check).
app.get("/", (req, res) => {
  res.send(
    "Server My-Portfolio running! Ready to connect to DB. Swagger documentation is at /docs"
  );
});

// Rute API Utama
// Menggunakan rute yang telah diimpor dan mengelompokkannya di bawah prefix `/api`.
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);

// -------------------------------------------------------------
// | 6. DATABASE CONNECTION & SERVER INITIALIZATION            |
// -------------------------------------------------------------

// Fungsi async untuk menghubungkan ke database dan kemudian memulai server.
const connectDBAndStartServer = async () => {
  // Memeriksa apakah koneksi sudah ada untuk menghindari koneksi ganda,
  // terutama di lingkungan serverless yang bisa me-reuse koneksi.
  if (!mongoose.connection.readyState) {
    try {
      // Mencoba menghubungkan ke MongoDB menggunakan URI dari variabel lingkungan.
      await mongoose.connect(MONGO_URI);
      console.log("✅ MongoDB connected successfully!");
    } catch (err) {
      // Jika koneksi gagal, catat error dan hentikan aplikasi di lingkungan non-produksi.
      // Di produksi (seperti Vercel), kita mungkin tidak ingin prosesnya mati total,
      // jadi kita hanya mencatat error. Vercel akan menangani timeout fungsi.
      console.error("❌ CONNECTION FAILED:", err.message);
      if (process.env.NODE_ENV !== "production") {
        process.exit(1);
      }
    }
  }

  if (
    // Hanya jalankan `app.listen` di lingkungan pengembangan lokal.
    // Di Vercel, platform itu sendiri yang akan menangani pemanggilan server.
    // File ini akan diekspor dan Vercel akan menjalankannya sebagai fungsi serverless.
    // Menjalankan `app.listen` di Vercel akan menyebabkan error atau perilaku tak terduga.
    process.env.NODE_ENV !== "test" &&
    process.env.VERCEL_ENV !== "production"
  ) {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }
};

// Memanggil fungsi untuk memulai seluruh proses.
connectDBAndStartServer();

// Mengekspor instance aplikasi Express.
// Ini adalah pola standar untuk aplikasi Node.js di Vercel.
// Vercel akan mengimpor 'app' ini dan menjalankannya sebagai fungsi serverless untuk setiap permintaan masuk.
module.exports = app;
