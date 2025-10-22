// backend/models/ProjectModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    // Judul Proyek (Wajib)
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
    },
    // Deskripsi Proyek (Wajib)
    description: {
        type: String,
        required: [true, 'Project description is required'],
    },
    // Teknologi yang Digunakan (Array of Strings)
    technologies: {
        type: [String], // Array of strings (e.g., ['React', 'Node.js', 'MongoDB'])
        required: [true, 'Technologies array cannot be empty'],
    },
    // URL Gambar Utama (dari Cloudinary)
    imageUrl: {
        type: String,
        required: [true, 'Project image URL is required'],
    },
    // Public ID dari Cloudinary (untuk menghapus gambar jika proyek dihapus)
    imagePublicId: {
        type: String,
        required: true,
    },
    // URL Live Demo
    demoUrl: {
        type: String,
        trim: true,
    },
    // URL Repository GitHub
    repoUrl: {
        type: String,
        trim: true,
    },
    // Referensi ke User Admin yang membuat proyek (Mengamankan data per user)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Mengacu pada Model User
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);