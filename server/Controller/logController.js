const Log = require('../Model/Log');
const Workout = require('../Model/WorkoutLog');



const logWorkout = async (req, res) => {
  const { workoutId, category, notes } = req.body;
  try {
    if (!workoutId || !category) {
      return res.status(400).json({ msg: 'Workout ID and category are required' });
    }
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(400).json({ msg: 'Invalid workout ID' });
    }
    const validCategories = ['strength', 'cardio', 'yoga', 'other'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ msg: 'Invalid category' });
    }
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    const log = new Log({
      user: req.user.id,
      workoutId,
      category: category.toLowerCase(),
      notes
    });
    await log.save();
    console.log('Workout logged:', { id: log._id, user: req.user.id, workoutId, category });
    res.json(log);
  } catch (err) {
    console.error('Log workout error:', {
      message: err.message,
      stack: err.stack,
      body: req.body,
      user: req.user
    });
    res.status(500).json({ msg: 'Server error: Failed to log workout' });
  }
};

const getLogs = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    const logs = await Log.find({ user: req.user.id }).sort({ createdAt: -1 });
    console.log('Fetched logs:', { count: logs.length, user: req.user.id });
    res.json(logs);
  } catch (err) {
    console.error('Get logs error:', {
      message: err.message,
      stack: err.stack,
      user: req.user
    });
    res.status(500).json({ msg: 'Server error: Failed to fetch logs' });
  }
};

const deleteLog = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    const log = await Log.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ msg: 'Log not found' });
    }
    if (log.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await log.deleteOne();
    console.log('Log deleted:', { id: req.params.id, user: req.user.id });
    res.json({ msg: 'Log deleted successfully' });
  } catch (err) {
    console.error('Delete log error:', {
      message: err.message,
      stack: err.stack,
      user: req.user
    });
    res.status(500).json({ msg: 'Server error: Failed to delete log' });
  }
};
module.exports = { logWorkout, getLogs, deleteLog };