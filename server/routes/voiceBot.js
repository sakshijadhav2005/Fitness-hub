const express = require('express');
const router = express.Router();
const { answerQuestion } = require('../Controller/voiceBotController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/answer', authMiddleware, answerQuestion);

module.exports = router;