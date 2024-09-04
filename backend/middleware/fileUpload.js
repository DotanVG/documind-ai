// middleware/fileUpload.js
const multer = require('multer');
const path = require('path');

const createUploadMiddleware = () => {
    return multer({
        dest: 'uploads/',
        limits: {
            fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
        },
        fileFilter: (req, file, cb) => {
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
        },
    });
};

module.exports = { createUploadMiddleware };
