// backend/controllers/ProjectController.js

const Project = require('../models/ProjectModel');
const cloudinary = require('../config/cloudinary.config');
const mongoose = require('mongoose');

// Helper untuk menghapus gambar dari Cloudinary
const deleteCloudinaryImage = async (publicId) => {
    if (publicId) {
        await cloudinary.uploader.destroy(publicId);
    }
};


// ---------------------------------
// | 1. CREATE Project (POST)      |
// ---------------------------------
const createProject = async (req, res) => {
    const { title, description, technologies, demoUrl, repoUrl } = req.body;
    const userId = req.user._id;
    let result;

    if (!req.file) {
        return res.status(400).json({ error: 'Image upload failed. No file provided.' });
    }

    try {
        // Upload file ke Cloudinary
        result = await cloudinary.uploader.upload(
            'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64'), 
            {
                folder: `my-portfolio-projects/${userId}`, 
                transformation: [ { width: 800, crop: 'limit' } ]
            }
        );
        
        // Memastikan technologies adalah array
        const techsArray = Array.isArray(technologies) 
            ? technologies 
            : technologies.split(',').map(tech => tech.trim());

        // Buat Objek Proyek Baru
        const project = await Project.create({
            title,
            description,
            technologies: techsArray,
            imageUrl: result.secure_url,
            imagePublicId: result.public_id,
            demoUrl,
            repoUrl,
            user: userId,
        });

        res.status(201).json({ 
            message: 'Project created successfully!',
            project
        });

    } catch (error) {
        console.error('Project creation failed:', error);
        // Jika ada kegagalan, hapus gambar yang sudah terlanjur di-upload ke Cloudinary
        if (result && result.public_id) {
             deleteCloudinaryImage(result.public_id);
        }
        res.status(400).json({ error: 'Project creation failed', details: error.message });
    }
};


// ---------------------------------
// | 2. READ All Projects (GET)    |
// ---------------------------------
const getProjects = async (req, res) => {
    try {
        // Ambil semua proyek, diurutkan berdasarkan tanggal terbaru
        const projects = await Project.find({})
            .sort({ createdAt: -1 });

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ---------------------------------
// | 3. READ Single Project (GET)  |
// ---------------------------------
const getProject = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such project' });
    }

    const project = await Project.findById(id);

    if (!project) {
        return res.status(404).json({ error: 'No such project' });
    }

    res.status(200).json(project);
};


// ---------------------------------
// | 4. DELETE Project (DELETE)    |
// ---------------------------------
const deleteProject = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such project' });
    }

    // Cari proyek dan pastikan itu milik user yang sedang login (keamanan)
    const project = await Project.findOneAndDelete({ _id: id, user: userId });

    if (!project) {
        // Jika tidak ditemukan atau tidak cocok dengan user ID
        return res.status(404).json({ error: 'No such project or not authorized to delete' });
    }

    // Hapus gambar dari Cloudinary
    await deleteCloudinaryImage(project.imagePublicId);

    res.status(200).json({ 
        message: 'Project deleted successfully!', 
        project 
    });
};


// ---------------------------------
// | 5. UPDATE Project (PATCH)     |
// ---------------------------------
const updateProject = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    let result;
    
    // Siapkan body update
    let updateBody = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such project' });
    }

    try {
        // Jika ada file baru yang di-upload
        if (req.file) {
            // 1. Ambil proyek lama untuk publicId
            const oldProject = await Project.findById(id);
            if (!oldProject) throw new Error('Project not found');

            // 2. Upload file baru
            result = await cloudinary.uploader.upload(
                'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64'), 
                {
                    folder: `my-portfolio-projects/${userId}`, 
                    transformation: [ { width: 800, crop: 'limit' } ]
                }
            );

            // 3. Tambahkan data gambar baru ke updateBody
            updateBody.imageUrl = result.secure_url;
            updateBody.imagePublicId = result.public_id;
            
            // 4. Hapus gambar lama dari Cloudinary
            await deleteCloudinaryImage(oldProject.imagePublicId);
        }

        // Handle technologies (jika dikirim sebagai string)
        if (updateBody.technologies && typeof updateBody.technologies === 'string') {
            updateBody.technologies = updateBody.technologies.split(',').map(tech => tech.trim());
        }

        // Lakukan update
        const project = await Project.findOneAndUpdate(
            { _id: id, user: userId }, 
            { ...updateBody }, 
            { new: true, runValidators: true } // new:true mengembalikan dokumen yang sudah diupdate
        );

        if (!project) {
            return res.status(404).json({ error: 'No such project or not authorized to update' });
        }

        res.status(200).json({ message: 'Project updated successfully!', project });

    } catch (error) {
        // Hapus gambar yang baru diupload jika update Mongoose gagal
        if (result && result.public_id) {
             await deleteCloudinaryImage(result.public_id);
        }
        res.status(400).json({ error: 'Project update failed', details: error.message });
    }
};


module.exports = {
    createProject,
    getProjects,
    getProject,
    deleteProject,
    updateProject
};