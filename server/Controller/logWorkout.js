const Log = require('../Model/Log');

const logWorkout = async (req, res) => {
  const { workoutId, category, notes } = req.body;
  if (!workoutId || !category) {
    return res.status(400).json({ msg: 'Please provide workoutId and category' });
  }
  try {
    const log = new Log({
      userId: req.user.id,
      workoutId,
      category,
      notes,
      createdAt: new Date(),
    });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    console.error('Log workout error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error('Get logs error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const deleteLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) return res.status(404).json({ msg: 'Log not found' });
    if (log.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await log.deleteOne();
    res.json({ msg: 'Log deleted' });
  } catch (err) {
    console.error('Delete log error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { logWorkout, getLogs, deleteLog };