// routes/analyze.js
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { analyzeDocument } = require('../services/aiService');

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

        // Check file size
        const fileSizeInMB = fileContent.length / (1024 * 1024);
        if (fileSizeInMB > 10) {
            // Adjust this limit as needed
            return res
                .status(413)
                .json({
                    error: 'File size exceeds the maximum limit of 10MB. Please upload a smaller file.',
                });
        }

        // Analyze the document using AI
        const result = await analyzeDocument(fileContent, query);

        // Delete the uploaded file after analysis
        await fs.unlink(filePath);

        res.json({ result });
    } catch (error) {
        console.error('Analysis error:', error);
        if (
            error.message.includes('context length') ||
            error.message.includes('tokens')
        ) {
            res.status(413).json({
                error: 'The document is too large or complex to process. Please try a smaller document, a more specific query, or break your document into smaller parts.',
            });
        } else if (error.message.includes('rate limit')) {
            res.status(429).json({
                error: "We're experiencing high demand. Please try again in a few minutes.",
            });
        } else {
            res.status(500).json({
                error: 'An unexpected error occurred during analysis. Please try again later or contact support if the problem persists.',
            });
        }
    }
});

module.exports = router;
