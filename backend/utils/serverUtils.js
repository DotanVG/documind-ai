// utils/serverUtils.js
const fs = require('fs').promises;
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');

const cleanupSessionFiles = async (uploadIds) => {
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
};

const cleanupAllUploads = async () => {
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
};

const setupGracefulShutdown = (server) => {
    const gracefulShutdown = async (signal) => {
        console.log(`${signal} received. Closing server gracefully`);
        server.close(async () => {
            console.log('Server closed');
            await cleanupAllUploads();
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

module.exports = {
    cleanupSessionFiles,
    cleanupAllUploads,
    setupGracefulShutdown,
};
