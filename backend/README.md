# ⚙️ Dokumentasi API: My-Portfolio Backend

Dokumen ini menjelaskan implementasi **Swagger UI** (Dokumentasi OpenAPI) untuk API *backend* yang di-deploy menggunakan **Vercel**. Implementasi ini dirancang untuk mengatasi masalah *path* aset statis (CSS, JS) dalam lingkungan *serverless* Vercel dengan mengintegrasikan konfigurasi dari empat *file* utama: `package.json`, `copy-files-from-to.json`, `vercel.json`, dan `server.js`.

---

## 1. Arsitektur dan Aliran Aset Statis

Integrasi Swagger UI yang sukses di Vercel memerlukan sinkronisasi antara penyalinan aset lokal dan *routing* pada server yang di-deploy.

### 1.1. Penyalinan Aset (Melalui `npm install`)

Proses ini memastikan aset statis Swagger UI tersedia di lokasi publik yang dapat diakses oleh server Express.

1.  **`package.json`**: Mengaktifkan *script* *post-install* untuk menyalin *file*:
    ```json
    // ...
    "scripts": {
      "postinstall": "npx copy-files-from-to --config copy-files-from-to.json"
    }
    // ...
    ```

2.  **`copy-files-from-to.json`**: Mendefinisikan sumber dan tujuan penyalinan:
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
    **Hasil:** Aset disalin ke **`public/docs-assets`**.

### 1.2. Penanganan Permintaan Aset (Routing)

Penanganan permintaan untuk aset statis ditangani oleh *middleware* Express.js, dengan *rewrite* Vercel sebagai lapisan penanganan *serverless*.

1.  **`backend/server.js` (Express Static Middleware)**:
    Server melayani aset yang disalin dari `public/docs-assets` pada *path* `/docs-assets`:
    ```javascript
    // ...
    const swaggerUiAssetPath = "/docs-assets";
    app.use(
      swaggerUiAssetPath,
      express.static(path.join(__dirname, "public", "docs-assets"))
    );
    // ...
    ```

2.  **`vercel.json` (Vercel Rewrite Rules)**:
    Aturan *rewrite* ini memastikan permintaan aset dirutekan dengan benar di lingkungan Vercel, dan semua *traffic* lainnya diarahkan ke *entry point* *backend*.
    ```json
    {
      "rewrites": [
        {
          "source": "/docs-assets/(.*)",
          "destination": "/backend/node_modules/swagger-ui-dist/$1"
        },
        {
          "source": "/(.*)",
          "destination": "/backend/server.js"
        }
      ]
    }
    ```

---

## 2. Inisialisasi Swagger UI (`/docs` Route)

Rute `/docs` adalah titik akhir yang menginisialisasi dan menyajikan UI interaktif, memastikan URL server yang benar disuntikkan.

```javascript
// backend/server.js (Rute /docs)
app.use("/docs", swaggerUi.serve, (req, res) => {
  // 1. Tentukan URL Server Dinamis
  const swaggerDoc = JSON.parse(JSON.stringify(swaggerDocument));
  const serverUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${PORT}`;
  swaggerDoc.servers = [{ url: serverUrl }];

  // 2. Tentukan Path CSS Kustom
  // Ini mengarahkan UI untuk mengambil CSS dari path yang dilayani oleh Express
  const swaggerUiOptions = {
    customCssUrl: `${swaggerUiAssetPath}/swagger-ui.css`,
  };

  // 3. Setup dan Sajikan UI
  const ui = swaggerUi.setup(swaggerDoc, swaggerUiOptions);
  ui(req, res);
});
3. Penggunaan
Setelah deployment sukses di Vercel, dokumentasi API dapat diakses melalui:

URL Dokumentasi: https://[URL_DOMAIN_ANDA]/docs

Pastikan variabel lingkungan seperti MONGO_URI, FRONTEND_URL, dan variabel lain yang relevan telah dikonfigurasi di pengaturan Vercel Anda.