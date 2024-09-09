// middleware/fileUpload.js
const multer = require('multer');
const path = require('path');

/**
 * Filters files based on allowed types.
 * @param {Object} req - Express request object
 * @param {Object} file - File object from multer
 * @param {function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'
            )
        );
    }
};

/**
 * Creates and configures the multer middleware for file uploads.
 * @returns {function} Configured multer middleware
 */
const createUploadMiddleware = () => {
    return multer({
        storage: multer.memoryStorage(), // Store file in memory as a Buffer
        limits: {
            fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
        },
        fileFilter: fileFilter,
    });
};

module.exports = { createUploadMiddleware };
