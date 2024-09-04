// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

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

// Routes
app.get('/', (req, res) => {
    res.send('DocuMind AI Server is running');
});

// Use route modules
app.use('/api/wakeUp', wakeUpRouter);
app.use('/api/analyze', createUploadMiddleware().single('file'), analyzeRouter);
app.use('/api/test-db', dbTestRouter);

// Error handling middleware
app.use(errorHandler);

let server;
if (process.env.NODE_ENV !== 'test') {
    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Function to close server and database connections
const closeServer = () => {
    return new Promise((resolve) => {
        if (server) {
            server.close(() => {
                console.log('Server closed');
                resolve();
            });
        } else {
            resolve();
        }
    });
};

module.exports = { app, closeServer };
