// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const { initializeRedisClient } = require('./services/cacheService');

// Import routes
const analyzeRouter = require('./routes/analyze');
const dbTestRouter = require('./routes/dbTest');
const wakeUpRouter = require('./routes/wakeUp');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { createUploadMiddleware } = require('./middleware/fileUpload');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: process.env.NODE_ENV === 'production' },
    })
);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Middleware to associate uploads with sessions
app.use((req, res, next) => {
    req.session.uploadIds = req.session.uploadIds || [];
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send('DocuMind AI Server is running');
});

// Use route modules
app.use('/api/wakeUp', wakeUpRouter);
app.use(
    '/api/analyze',
    createUploadMiddleware().single('file'),
    (req, res, next) => {
        if (req.file) {
            req.session.uploadIds.push(req.file.filename);
        }
        next();
    },
    analyzeRouter
);
app.use('/api/test-db', dbTestRouter);

// Error handling middleware
app.use(errorHandler);

/**
 * Cleans up files associated with a specific session.
 * @param {string[]} uploadIds - Array of file IDs to be deleted
 * @returns {Promise<void>}
 */
async function cleanupSessionFiles(uploadIds) {
    console.log(`Cleaning up files for session: ${uploadIds}`);
    for (const fileId of uploadIds) {
        const filePath = path.join(uploadsDir, fileId);
        try {
            await fs.unlink(filePath);
            console.log(`Deleted file: ${fileId}`);
        } catch (error) {
            console.error(`Error deleting file ${fileId}:`, error);
        }
    }
}

/**
 * Cleans up all files in the uploads directory.
 * @returns {Promise<void>}
 */
async function cleanupAllUploads() {
    console.log('Cleaning up all uploads');
    try {
        const files = await fs.readdir(uploadsDir);
        for (const file of files) {
            const filePath = path.join(uploadsDir, file);
            await fs.unlink(filePath);
            console.log(`Deleted file: ${file}`);
        }
    } catch (error) {
        console.error('Error cleaning up uploads:', error);
    }
}

// Session end listener
app.use((req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        } else if (req.session && req.session.uploadIds) {
            cleanupSessionFiles(req.session.uploadIds).catch(console.error);
        }
    });
    next();
});

let server;
if (process.env.NODE_ENV !== 'test') {
    server = app.listen(PORT, async () => {
        console.log(`Server is running on port ${PORT}`);
        try {
            await initializeRedisClient();
            console.log('Redis client initialized');
        } catch (error) {
            console.error('Failed to initialize Redis client:', error);
        }
    });
}

/**
 * Closes the server and performs cleanup operations.
 * @returns {Promise<void>}
 */
const closeServer = async () => {
    return new Promise((resolve) => {
        console.log('Closing server...');
        if (server) {
            server.close(async () => {
                console.log('Server closed');
                await cleanupAllUploads();
                resolve();
            });
        } else {
            resolve();
        }
    });
};

let isShuttingDown = false;

/**
 * Handles graceful shutdown of the server.
 * @param {string} signal - The signal received (e.g., 'SIGINT', 'SIGTERM')
 */
async function gracefulShutdown(signal) {
    if (isShuttingDown) {
        console.log('Shutdown already in progress');
        return;
    }

    isShuttingDown = true;
    console.log(`${signal} received. Closing server gracefully`);

    // Set a timeout for the graceful shutdown
    const shutdownTimeout = setTimeout(() => {
        console.error(
            'Could not close connections in time, forcefully shutting down'
        );
        process.exit(1);
    }, 10000); // 10 seconds timeout

    try {
        await closeServer();
        console.log('Cleanup completed');
        clearTimeout(shutdownTimeout);
        process.exit(0);
    } catch (error) {
        console.error('Error during graceful shutdown:', error);
        clearTimeout(shutdownTimeout);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = { app, closeServer, cleanupAllUploads };
