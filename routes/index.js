const express = require('express');
const router = express.Router();

// Main Page
router.get('/', (req, res) => {
    res.render('../views/home.html');
});

module.exports = router;
