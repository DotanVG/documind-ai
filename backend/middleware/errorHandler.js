// middleware/errorHandler.js
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res
                .status(400)
                .json({ error: 'File size is too large. Max size is 10MB.' });
        }
    }
    res.status(500).json({ error: err.message || 'Something went wrong!' });
};

module.exports = errorHandler;
