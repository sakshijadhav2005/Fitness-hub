const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function generatePlanWithGemini(prompt) {
  try {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt must be a non-empty string');
    }
    const request = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    };
    const result = await model.generateContent(request);
    const response = await result.response;
    const text = response.text();
    console.log('Raw Gemini response:', text); 
    const cleanedText = text.replace(/```json\n|\n```/g, '').trim();
    try {
      const parsed = JSON.parse(cleanedText);
      if (!Array.isArray(parsed)) {
        throw new Error('Parsed response is not an array');
      }
      return parsed; 
    } catch (error) {
      console.error('Failed to parse JSON:', error.message, 'Cleaned text:', cleanedText);
      return [{ day: 'Unknown', exercises: [{ name: 'Error', sets: 0, reps: '0', rest: '0s', description: cleanedText }] }];
    }
  } catch (error) {
    console.error('Gemini generation failed:', error.message);
    throw new Error(`Gemini generation failed: ${error.message}`);
  }
}
// async function generateAnswer(prompt, retries = 3, delayMs = 1000) {
//   for (let attempt = 0; attempt < retries; attempt++) {
//     try {
//       console.log(`Attempt ${attempt + 1} to generate answer with prompt:`, prompt);
//       const result = await model.generateContent(prompt);
//       console.log('Gemini API full response:', JSON.stringify(result, null, 2));
//       const answerText = result.response.text().trim();
//       console.log('Generated answer text:', answerText);
//       return answerText;
//     } catch (err) {
//       console.error(`Attempt ${attempt + 1} failed:`, err.message);
//       if (err.message.includes('503 Service Unavailable') && attempt < retries - 1) {
//         await delay(delayMs * Math.pow(2, attempt));
//         continue;
//       }
//       if (attempt === retries - 1) {
//         console.error('All retries exhausted:', err.message, err.stack);
//         return 'Sorry, I’m having trouble connecting right now. Try again in a bit!';
//       }
//       throw err;
//     }
//   }
// }





require('dotenv').config();



const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateAnswer(prompt, retries = 3, delayMs = 1000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1} to generate answer with prompt:`, prompt);
      const result = await model.generateContent(prompt);
      const answerText = result.response.text().trim();
      console.log('Generated answer text:', answerText);
      return answerText;
    } catch (err) {
      console.error(`Attempt ${attempt + 1} failed:`, { message: err.message, status: err.status });
      if (err.status === 503 && attempt < retries - 1) {
        await delay(delayMs * Math.pow(2, attempt));
        continue;
      }
      return 'Sorry, I’m having trouble connecting right now. Try again!';
    }
  }
}



module.exports = { generatePlanWithGemini, generateAnswer };