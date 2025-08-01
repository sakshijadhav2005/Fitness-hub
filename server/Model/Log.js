
const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
  category: { type: String, enum: ['strength', 'cardio', 'yoga', 'other', 'ai_plan'] },
  notes: { type: String },
  workoutPlan: [{
    day: { type: String },
    exercises: [{
      name: { type: String, required: true },
      sets: { type: Number },
      reps: { type: String },
      rest: { type: String },
      description: { type: String }, // Added for Gemini API detailed descriptions
    }],
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', logSchema);