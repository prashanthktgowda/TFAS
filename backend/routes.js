const express = require('express');
const router = express.Router();

// Sample route
router.get('/api/sample', (req, res) => {
    res.json({ message: 'This is a sample API response' });
});

module.exports = router;
