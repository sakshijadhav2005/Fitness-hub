const Workout = require('../Model/WorkoutLog');

const createWorkout = async (req, res) => {
  const { name, exercises, category } = req.body;
  if (!name || !exercises || !category) {
    return res.status(400).json({ msg: 'Please provide name, exercises, and category' });
  }
  try {
    const workout = new Workout({
      userId: req.user.id,
      name,
      exercises,
      category,
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    console.error('Create workout error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    console.error('Get workouts error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ msg: 'Workout not found' });
    if (workout.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await workout.deleteOne();
    res.json({ msg: 'Workout deleted' });
  } catch (err) {
    console.error('Delete workout error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
const updateWorkout = async (req, res) => {
  try {
    const { name, exercises, category } = req.body;
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ msg: 'Workout not found' });
    if (workout.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    workout.name = name || workout.name;
    workout.exercises = exercises || workout.exercises;
    workout.category = category || workout.category;
    await workout.save();
    res.json(workout);
  } catch (err) {
    console.error('Update workout error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// GET /api/workouts/user/:userId
const getWorkoutsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Only select name, category, createdAt fields
    const workouts = await Workout.find({ userId }).select('name category createdAt');

    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error fetching workouts by user:', error);
    res.status(500).json({ message: 'Failed to fetch workouts for user' });
  }
};


// DELETE a workout


// DELETE /api/workouts/user/:userId/:workoutId
const deleteWorkoutByUser = async (req, res) => {
  const {  workoutId } = req.params;

  //console.log("Incoming DELETE request - userId:", userId, "workoutId:", workoutId); // 👈 ADD THIS

  try {
    const workout = await Workout.findOneAndDelete({
      _id: workoutId,
    
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found or unauthorized' });
    }

    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};








module.exports = { createWorkout, getWorkouts, deleteWorkout , updateWorkout, getWorkoutsByUser, deleteWorkoutByUser };