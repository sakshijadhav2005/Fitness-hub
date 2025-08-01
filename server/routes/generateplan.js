const express = require('express');
const router = express.Router();
const { generatePlanWithGemini } = require('../utils/gemini');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt must be a non-empty string' });
    }
    const plan = await generatePlanWithGemini(prompt);
    res.json({ plan });
  } catch (error) {
    console.error('Route error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



