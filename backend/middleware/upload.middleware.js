// backend/middleware/upload.middleware.js

const multer = require('multer');

// Konfigurasi Multer untuk menyimpan file di memory (buffer)
// Ini adalah cara yang direkomendasikan saat menggunakan Cloudinary
const storage = multer.memoryStorage();

// Filter untuk memastikan hanya gambar yang diizinkan
const fileFilter = (req, file, cb) => {
    // Memeriksa jenis file (mime type)
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Terima file
    } else {
        cb(new Error('File is not an image'), false); // Tolak file
    }
};

// Inisialisasi Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Batasi ukuran file hingga 5MB
    }
});

// Kita akan menggunakannya untuk upload satu file dengan nama field 'projectImage'
const uploadImageMiddleware = upload.single('projectImage');

module.exports = uploadImageMiddleware;