// routes/analyze.js
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { analyzeDocument } = require('../services/aiService'); // You'll need to implement this

router.post('/', async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'No query provided' });
        }

        const filePath = path.join(__dirname, '..', req.file.path);
        const fileContent = await fs.readFile(filePath, 'utf8');

        // Analyze the document using AI
        const result = await analyzeDocument(fileContent, query);

        // Delete the uploaded file after analysis
        await fs.unlink(filePath);

        res.json({ result });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
