const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const connectDB = require('./DB/db');
const workoutRoutes = require('./routes/workouts');
const logRoutes = require('./routes/logs');
const generateplan = require('./routes/generateplan');
const voiceBotRoutes = require('./routes/voiceBot');

require('dotenv').config(); 
const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/logs', logRoutes);
app.use ('/api/generateWorkoutPlan', generateplan);
app.use('/api/voicebot', voiceBotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




