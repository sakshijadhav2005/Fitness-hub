const { generateAnswer } = require('../utils/gemini');

const answerQuestion = async (req, res) => {
  const { question } = req.body;
  try {
    if (!question) {
      return res.status(400).json({ msg: 'Question is required' });
    }
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    const prompt = `
      You are a fitness coach. Answer the following question in a friendly, conversational tone:
      "${question}"
      - If the question involves equipment, consider: None, Barbell, Dumbbell, Kettlebell, Pull-Up Bar, Bike, Jump Rope.
      - Keep the answer concise, under 100 words.
      - Start with a friendly phrase like "Hey" or "Awesome question".
    `;
    const answer = await generateAnswer(prompt);
    console.log('Voice bot answered:', { question, answer });
    res.json({ answer });
  } catch (err) {
    console.error('Voice bot error:', {
      message: err.message,
      stack: err.stack,
      body: req.body,
      user: req.user
    });
    res.status(500).json({ msg: 'Server error: Failed to answer question', answer: 'Sorry, I’m having trouble answering. Try again!' });
  }
};

module.exports = { answerQuestion };