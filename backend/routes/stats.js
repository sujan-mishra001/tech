const express = require('express');
const router = express.Router();
const { getContentStats } = require('../controllers/statsController');

// Get content statistics
router.get('/content', getContentStats);

module.exports = router;
