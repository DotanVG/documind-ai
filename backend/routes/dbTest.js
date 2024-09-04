// routes/dbTest.js
const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ result: result.rows[0] });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

module.exports = router;
