const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = 'AIzaSyBmi2EFL-Lw5vgns4d5N7b1fgDpBuNWI7Y'; // put this in .env and use process.env

const generateWorkoutFromGemini = async (formData) => {
 
const prompt = `
  Generate a workout plan for a ${formData.fitnessLevel} level user aiming for ${formData.goal}.
  Available equipment: ${formData.equipment.length > 0 ? formData.equipment.join(', ') : 'None'}.
  Training days: ${formData.schedule}.
  Return the response in JSON format with an array of objects, each containing:
  - day: string (e.g., "Monday")
  - exercises: array of objects with name (string), sets (number), reps (string), rest (string), description (string).
  Example: [
    {
      "day": "Monday",
      "exercises": [
        { "name": "Push-ups", "sets": 3, "reps": "10-12", "rest": "60s", "description": "Standard push-ups" }
      ]
    }
  ]
`.trim();;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const res = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, requestBody);
  return res.data.candidates[0].content.parts[0].text;
};

module.exports = generateWorkoutFromGemini;
