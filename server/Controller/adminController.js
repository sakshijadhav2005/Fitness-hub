const User = require('../Model/User');
const WorkoutPlan = require('../Model/WorkoutLog');


const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    await WorkoutPlan.deleteMany({ userId: req.params.id });
    await MealLog.deleteMany({ userId: req.params.id });
    res.status(200).json({ message: 'User and associated data deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getWorkoutPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find().populate('userId', 'username email');
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    await WorkoutPlan.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Workout plan deleted' });
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



module.exports = {
  getUsers,
  deleteUser,
  getWorkoutPlans,
  deleteWorkoutPlan,

};