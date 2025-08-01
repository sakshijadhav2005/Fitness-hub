const express = require('express');
const router = express.Router();
const { createWorkout, getWorkouts, deleteWorkout, updateWorkout , getWorkoutsByUser,deleteWorkoutByUser} = require('../Controller/workoutController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createWorkout);
router.get('/', authMiddleware, getWorkouts);
router.delete('/:id',   authMiddleware,  deleteWorkout);
router.patch('/:id', authMiddleware, updateWorkout);

// Get workouts by userId (Admin panel)
router.get('/user/:userId', authMiddleware, getWorkoutsByUser);
router.delete('/user/:workoutId', authMiddleware, deleteWorkoutByUser); // ✅ delete by user & workoutId
// backend/routes/workouts.js
//router.delete('/user/:userId/:workoutId', deleteWorkoutByUser);

module.exports = router;