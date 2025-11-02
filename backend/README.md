# Deploying Express Swagger UI on Vercel: A Comprehensive Guide

This document explains a robust, hybrid solution for deploying API documentation built with `swagger-ui-express` on both a local server and a serverless platform like Vercel. This approach avoids common errors like `MIME type ('text/html')` and broken UI styling.

## Daftar Isi

1.  The Core Problem
2.  The Hybrid Solution
3.  Implementation Details

---

## 1. The Core Problem

When deploying an Express app with `swagger-ui-express`, the challenge is serving its static assets (CSS, JS) in two different environments:

- **Local Environment (`npm run dev`):** The Express server is solely responsible for handling all requests.
- **Vercel Environment (Production):** Vercel's infrastructure intercepts requests first, and its routing rules (`vercel.json`) determine how they are handled.

The root cause of most issues is that Vercel, by default, cannot serve files from a serverless function's `node_modules` directory as public static assets.

## 2. The Hybrid Solution

This project uses a clean, hybrid approach where both environments serve assets directly from `node_modules`, but using different mechanisms.

1.  **For Vercel (Production):** We use a `rewrite` rule in `vercel.json`. This rule intercepts requests for Swagger's assets and tells Vercel to serve them directly from the `node_modules` directory of the build package. This is efficient and bypasses the Express server entirely for these assets.
2.  **For Local Development:** We use `express.static` in `server.js`. The `swagger-ui-dist` package provides a helper function, `getAbsoluteFSPath()`, which reliably finds the path to its assets within `node_modules`. This allows the local Express server to serve the same files directly.

This unified strategy eliminates the need for extra build steps, file copying, or a `public` directory for Swagger assets.

## 3. Implementation Details

### Vercel Configuration (`vercel.json`)

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

**Alasan Keberhasilan:** Saat Vercel membangun proyek Node.js, ia memaketkan seluruh direktori `node_modules` yang relevan bersama dengan kode server Anda. Ternyata, sistem `rewrites` Vercel dapat "mengintip" ke dalam paket build ini dan menyajikan file secara langsung sebelum permintaan tersebut dieksekusi sebagai _serverless function_. Ini memungkinkan Vercel untuk menemukan dan menyajikan file CSS dari `node_modules/swagger-ui-dist`.

**Penting untuk diketahui:** Ini adalah perilaku internal Vercel yang tidak terdokumentasi secara luas. Ini bisa dianggap "rapuh" karena jika Vercel mengubah cara mereka membangun proyek di masa depan, metode ini bisa tiba-tiba rusak. Namun, untuk saat ini, ini adalah solusi yang berfungsi dengan baik untuk proyek ini.
