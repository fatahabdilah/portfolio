// backend/controllers/uploadController.js

const cloudinary = require('../config/cloudinary.config'); // Import konfigurasi Cloudinary

// Controller Pengujian Upload
const testUpload = async (req, res) => {
    // 1. Pastikan file ada
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
    }

    try {
        // 2. Upload file ke Cloudinary
        // req.file.buffer adalah data gambar yang disimpan Multer di memori
        const result = await cloudinary.uploader.upload(
            'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64'), 
            {
                folder: 'my-portfolio-test-uploads', // Folder di Cloudinary
                transformation: [ // Contoh transformasi (membuat thumbnail)
                    { width: 500, crop: 'scale' }
                ]
            }
        );

        // 3. Kirim respons sukses dengan detail Cloudinary
        res.status(200).json({
            message: 'Image uploaded successfully to Cloudinary!',
            imageUrl: result.secure_url,
            publicId: result.public_id,
            fileMimeType: req.file.mimetype,
        });

    } catch (error) {
        console.error('Cloudinary Upload Failed:', error);
        res.status(500).json({ 
            error: 'Failed to upload image.',
            details: error.message 
        });
    }
};

module.exports = {
    testUpload
};