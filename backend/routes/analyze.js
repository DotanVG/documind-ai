// routes/analyze.js
const express = require('express');
const router = express.Router();
const { analyzeDocument } = require('../services/aiService');
const { upload } = require('../middleware/fileUpload');

router.post('/', upload.single('file'), async (req, res, next) => {
    try {
        console.log('Received file:', req.file);

        if (!req.file || !req.file.buffer) {
            return res
                .status(400)
                .json({ error: 'No file uploaded or file buffer is missing' });
        }

        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'No query provided' });
        }

        // Check file size
        const fileSizeInMB = req.file.size / (1024 * 1024);
        if (fileSizeInMB > 10) {
            // Adjust this limit as needed
            return res.status(413).json({
                error: 'File size exceeds the maximum limit of 10MB. Please upload a smaller file.',
            });
        }

        console.log('File type:', req.file.mimetype); // Log the file type
        console.log('Query:', query); // Log the query

        // Analyze the document using AI
        const result = await analyzeDocument(
            req.file.buffer,
            req.file.mimetype,
            query
        );

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
