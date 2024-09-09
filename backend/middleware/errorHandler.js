// middleware/errorHandler.js
const { MulterError } = require('multer');

/**
 * Custom error handler middleware for centralized error management.
 * @param {Error} err - The error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res
                .status(400)
                .json({ error: 'File size is too large. Max size is 10MB.' });
        }
        return res.status(400).json({ error: err.message });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Invalid token' });
    }

    // Default to 500 server error
    res.status(500).json({ error: 'An unexpected error occurred' });
};

module.exports = errorHandler;
