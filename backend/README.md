# ⚙️ Dokumentasi API: My-Portfolio Backend

Dokumen ini menjelaskan implementasi **Swagger UI** (Dokumentasi OpenAPI) untuk API *backend* yang di-deploy menggunakan **Vercel**. Pendekatan ini menggunakan *script* *build* Vercel untuk penyalinan aset statis, yang merupakan metode yang ringkas dan efisien.

---

## 1. Arsitektur dan Aliran Aset Statis

Integrasi Swagger UI yang sukses di Vercel memerlukan sinkronisasi antara penyalinan aset statis dan *routing* Vercel/Express.

### 1.1. Penyalinan Aset (Melalui `vercel-build`)

Penyalinan aset Swagger UI dilakukan langsung menggunakan *command* *copy* di *script* `vercel-build` pada `package.json`. Ini memastikan aset statis tersedia di lokasi publik sebelum server Express dimulai.

1.  **`package.json`**: Menggunakan *script* `vercel-build` yang dijalankan Vercel sebelum *startup*:
    ```json
    // ...
    "scripts": {
      // ...
      "vercel-build": "mkdir -p public/docs-assets && cp -r node_modules/swagger-ui-dist/* public/docs-assets/",
      // ...
    },
    // ...
    ```
    **Hasil:** Aset disalin dari `node_modules/swagger-ui-dist/` ke **`<project-root>/public/docs-assets`**.

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