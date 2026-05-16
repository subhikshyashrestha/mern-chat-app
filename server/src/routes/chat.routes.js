const express = require('express');
const router = express.Router();
const { getMessages, getStats } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth');

router.get('/messages', protect, getMessages);
router.get('/stats', protect, getStats);

module.exports = router;