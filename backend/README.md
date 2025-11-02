# Deploying Express Swagger UI on Vercel: A Comprehensive Guide

Dokumen ini menjelaskan solusi lengkap dan andal untuk men-deploy dokumentasi API yang dibuat dengan `swagger-ui-express` pada platform serverless seperti Vercel. Mengikuti panduan ini akan membantu Anda menghindari error umum seperti `MIME type ('text/html')` dan tampilan UI yang berantakan.

## Daftar Isi

1. Masalah Umum
2. Strategi Solusi: "Copy & Serve"
3. Implementasi Langkah-demi-Langkah
   - Langkah 1: Salin Aset Statis Swagger
   - Langkah 2: Sajikan Aset yang Telah Disalin
   - Langkah 3: Konfigurasi Swagger UI Secara Dinamis
4. Mengapa Solusi Ini Berhasil?

---

## 1. Masalah Umum

Saat men-deploy aplikasi Express dengan `swagger-ui-express` ke Vercel, banyak developer menghadapi masalah berikut:

- **Tampilan Berantakan**: Halaman Swagger muncul tanpa gaya (styling) CSS.
- **Error MIME Type**: Console browser menampilkan error `Refused to apply style from '...' because its MIME type ('text/html') is not a supported stylesheet MIME type`.

**Akar Masalah**: `swagger-ui-express` mencoba menyajikan file asetnya (CSS, JS) dari dalam direktori `node_modules`. Lingkungan serverless Vercel tidak dapat mengakses atau menyajikan file dari `node_modules` sebagai aset statis publik secara default. Akibatnya, ketika browser meminta file CSS, Vercel mengembalikan halaman HTML (seringkali halaman 404), yang menyebabkan error MIME type.

## 2. Strategi Solusi: "Copy & Serve"

Daripada mencoba "mengakali" routing Vercel untuk menemukan `node_modules`, kita akan menggunakan pendekatan yang lebih eksplisit dan andal:

1.  **Copy**: Selama proses build di Vercel (setelah `npm install`), kita akan menyalin semua file aset yang diperlukan dari `node_modules/swagger-ui-dist` ke dalam direktori `public` di dalam proyek kita.
2.  **Serve**: Kita akan mengkonfigurasi Express untuk menyajikan file dari direktori `public` ini sebagai aset statis.
3.  **Configure**: Kita akan memberitahu `swagger-ui-express` secara eksplisit di mana menemukan file CSS-nya, sambil secara dinamis mengatur URL server API berdasarkan lingkungan (lokal vs. produksi).

## 3. Implementasi Langkah-demi-Langkah

### Langkah 1: Salin Aset Statis Swagger

Kita menggunakan skrip `postinstall` di `package.json` untuk mengotomatiskan proses penyalinan file setiap kali dependensi di-install.

**`package.json`**:

```json
{
  "scripts": {
    // Skrip ini akan berjalan secara otomatis di Vercel setelah 'npm install'
    "postinstall": "npx copy-files-from-to --config copy-files-from-to.json"
  },
  "devDependencies": {
    // Tambahkan library ini untuk membantu proses penyalinan
    "copy-files-from-to": "^3.9.0"
  }
}
```

**`copy-files-from-to.json`**:
Buat file ini untuk mendefinisikan file apa yang akan disalin dan ke mana.

```json
{
  "copyFiles": [
    {
      "from": "node_modules/swagger-ui-dist/*.{js,css,html,png}",
      "to": "public/docs-assets"
    }
  ]
}
```

### Langkah 2: Sajikan Aset yang Telah Disalin

Di `server.js`, kita perlu memberitahu Express untuk menyajikan file dari direktori `public/docs-assets` yang baru kita buat.

**`server.js`**:

```javascript
// Definisikan path yang akan digunakan untuk mengakses aset Swagger.
const swaggerUiAssetPath = "/docs-assets";

// Sajikan direktori 'public/docs-assets' yang berisi aset Swagger yang sudah disalin.
// path.join memastikan path ini bekerja di semua sistem operasi.
app.use(
  swaggerUiAssetPath,
  express.static(path.join(__dirname, "public", "docs-assets"))
);
```

### Langkah 3: Konfigurasi Swagger UI Secara Dinamis

Ini adalah bagian terpenting di `server.js` yang menyatukan semuanya.

**`server.js`**:

```javascript
app.use("/docs", swaggerUi.serve, (req, res) => {
  // 1. Buat salinan dokumen untuk setiap permintaan.
  // Ini mencegah modifikasi objek asli yang di-cache, yang bisa menyebabkan masalah di lokal.
  const swaggerDoc = JSON.parse(JSON.stringify(swaggerDocument));

  // 2. Tentukan URL server API secara dinamis.
  // Gunakan URL Vercel jika tersedia, jika tidak, gunakan localhost.
  const serverUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${PORT}`;
  swaggerDoc.servers = [{ url: serverUrl }];

  // 3. Beri tahu Swagger UI di mana menemukan aset statisnya.
  // Ini adalah langkah kunci untuk memperbaiki tampilan yang berantakan.
  const swaggerUiOptions = {
    customCssUrl: `${swaggerUiAssetPath}/swagger-ui.css`,
  };

  // 4. Render halaman Swagger UI dengan dokumen dan opsi yang sudah dikustomisasi.
  const ui = swaggerUi.setup(swaggerDoc, swaggerUiOptions);
  ui(req, res);
});
```

## 4. Mengapa Solusi Ini Berhasil?

Pendekatan ini sangat kuat karena **eksplisit dan tidak bergantung pada "sihir" platform**.

- **Konsisten**: Proses build (menyalin file) dan penyajian (Express) bekerja dengan cara yang sama di lingkungan lokal dan di Vercel.
- **Andal**: Kita tidak lagi mencoba memaksa Vercel untuk menemukan file di `node_modules`. Sebaliknya, kita menempatkan aset di lokasi yang dirancang untuk disajikan (`public`), yang dijamin akan ditemukan oleh Express.
- **Bersih**: Konfigurasi menjadi lebih sederhana karena kita tidak memerlukan file `vercel.json` dengan aturan `rewrites` yang rumit. Semua logika terkandung di dalam kode aplikasi kita.

Dengan mengikuti metode ini, Anda dapat dengan percaya diri men-deploy dokumentasi Swagger yang fungsional dan terlihat bagus di Vercel setiap saat.

---

## Catatan Tambahan: Mengapa Konfigurasi `vercel.json` Saat Ini Berhasil?

Setelah melalui berbagai percobaan, konfigurasi `vercel.json` yang akhirnya berhasil adalah yang mengarah langsung ke `node_modules`:

```json
{
  "source": "/docs-assets/(.*)",
  "destination": "/backend/node_modules/swagger-ui-dist/$1"
}
```

**Alasan Keberhasilan:** Saat Vercel membangun proyek Node.js, ia memaketkan seluruh direktori `node_modules` yang relevan bersama dengan kode server Anda. Ternyata, sistem `rewrites` Vercel dapat "mengintip" ke dalam paket build ini dan menyajikan file secara langsung sebelum permintaan tersebut dieksekusi sebagai *serverless function*. Ini memungkinkan Vercel untuk menemukan dan menyajikan file CSS dari `node_modules/swagger-ui-dist`.

**Penting untuk diketahui:** Ini adalah perilaku internal Vercel yang tidak terdokumentasi secara luas. Ini bisa dianggap "rapuh" karena jika Vercel mengubah cara mereka membangun proyek di masa depan, metode ini bisa tiba-tiba rusak. Namun, untuk saat ini, ini adalah solusi yang berfungsi dengan baik untuk proyek ini.
