// backend/middleware/upload.middleware.js

const multer = require('multer');

// Configuration: Store files in memory buffer instead of disk.
// This is the standard method when immediately processing and uploading to services like Cloudinary.
const storage = multer.memoryStorage();

/**
 * @desc File filter to ensure only image mime types are accepted.
 * @param {Object} req - Express request object.
 * @param {Object} file - The file object being uploaded.
 * @param {Function} cb - The callback function.
 */
const fileFilter = (req, file, cb) => {
    // Check file's MIME type
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept file
    } else {
        // Reject file and throw an error message
        cb(new Error('File is not an image type.'), false); 
    }
};

// Initialize Multer instance with configurations
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        // Limit file size to 5MB (5 * 1024 * 1024 bytes)
        fileSize: 5 * 1024 * 1024, 
    }
});

/**
 * @desc Main middleware export: Configured to handle a single file upload.
 * The file will be available under req.file in the controller.
 * @type {Function}
 */
const uploadImageMiddleware = upload.single('projectImage');

module.exports = uploadImageMiddleware;