// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const { initializeRedisClient } = require('./services/cacheService');

// Import routes
const analyzeRouter = require('./routes/analyze');
const dbTestRouter = require('./routes/dbTest');
const wakeUpRouter = require('./routes/wakeUp');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const {
    setupUploadDirectory,
    associateUploadsWithSession,
} = require('./middleware/fileUpload');

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

// Setup upload directory and associate uploads with sessions
setupUploadDirectory();
app.use(associateUploadsWithSession);

// Routes
app.get('/', (req, res) => {
    res.send('DocuMind AI Server is running');
});

app.use('/api/wakeUp', wakeUpRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/test-db', dbTestRouter);

// Error handling middleware
app.use(errorHandler);

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

const { setupGracefulShutdown } = require('./utils/serverUtils');
setupGracefulShutdown(server);

module.exports = { app, server };
