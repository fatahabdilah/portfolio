// backend/routes/projectRoutes.js

const express = require('express');
const { 
    createProject, 
    getProjects, 
    getProject, 
    deleteProject, 
    updateProject 
} = require('../controllers/ProjectController');
const requireAuth = require('../middleware/requireAuth'); // Middleware JWT
const uploadImageMiddleware = require('../middleware/upload.middleware'); // Middleware Multer

const router = express.Router();

// Semua rute di bawah ini memerlukan otentikasi (JWT)
// Ini mengamankan semua rute proyek secara default
router.use(requireAuth); 

// GET /api/projects - Ambil semua proyek (PUBLIK DENGAN OPSI AMAN)
// Jika Anda ingin ini publik, hapus router.use(requireAuth) dan pindahkan middleware ke rute ini.
router.get('/', getProjects);

// GET /api/projects/:id - Ambil satu proyek
router.get('/:id', getProject);

// POST /api/projects - Buat proyek baru (PRIVATE)
router.post('/', uploadImageMiddleware, createProject);

// DELETE /api/projects/:id - Hapus proyek (PRIVATE)
router.delete('/:id', deleteProject);

// PATCH /api/projects/:id - Update proyek (PRIVATE)
// Menggunakan middleware upload karena gambar bisa diupdate
router.patch('/:id', uploadImageMiddleware, updateProject); 

module.exports = router;