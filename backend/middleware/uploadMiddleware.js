// backend/middleware/uploadMiddleware.js

const multer = require('multer');

// Configuration: Store files in memory buffer instead of disk.
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
 * @desc Exports a factory function that creates a Multer middleware
 * configured to handle a single file upload using the specified field name.
 * * @param {string} fieldName - The name of the file field in the form-data (e.g., 'projectImage', 'thumbnail').
 * @returns {Function} Multer middleware function (upload.single(fieldName)).
 */
const createUploadMiddleware = (fieldName) => {
    return upload.single(fieldName);
};

// Ekspor fungsi factory, bukan middleware instan
module.exports = createUploadMiddleware;