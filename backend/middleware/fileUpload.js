// middleware/fileUpload.js
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '..', 'uploads');

const setupUploadDirectory = async () => {
    try {
        await fs.mkdir(uploadsDir, { recursive: true });
    } catch (error) {
        console.error('Error creating uploads directory:', error);
    }
};

const associateUploadsWithSession = (req, res, next) => {
    req.session.uploadIds = req.session.uploadIds || [];
    next();
};

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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

module.exports = { setupUploadDirectory, associateUploadsWithSession, upload };
