const generateWorkoutFromGemini = require('../services/geminiService');

const generateWorkoutPlan = async (req, res) => {
  try {
    const formData = req.body;

    // Call Gemini AI
    const planText = await generateWorkoutFromGemini(formData);

    // Parse response
    const workoutPlan = JSON.parse(planText);

    res.status(200).json({ workoutPlan });
  } catch (err) {
    console.error('Error generating workout plan:', err.message);
    res.status(500).json({ msg: 'Failed to generate workout plan', error: err.message });
  }
};

module.exports = { generateWorkoutPlan };
