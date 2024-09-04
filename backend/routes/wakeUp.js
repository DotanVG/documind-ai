// routes/wakeUp.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend server is awake and ready!' });
});

module.exports = router;
