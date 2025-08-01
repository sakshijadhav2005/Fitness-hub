
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: Number },
      reps: { type: Number },
      duration: { type: Number },
    },
  ],
  category: { type: String, enum: ['strength', 'cardio', 'yoga', 'other'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workout', workoutSchema);