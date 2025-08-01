

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkouts, createWorkout, deleteWorkout, updateWorkout } from '../services/api';
import Navbartwo from '../Components/Navbartwo';
import { Bar } from 'react-chartjs-2';

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: 'strength',
    exercises: [{ name: '', sets: '', reps: '', duration: '' }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('Token for fetchWorkouts:', token);
        if (!token) {
          setError('Please log in to view workouts');
          navigate('/login');
          return;
        }
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (err) {
        console.error('Fetch workouts error:', err);
        setError(err.response?.data?.msg || 'Failed to load workouts');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [navigate]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('exercise')) {
      const newExercises = [...formData.exercises];
      newExercises[index][name.split('.')[1]] = value;
      setFormData({ ...formData, exercises: newExercises });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

 
  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: '', reps: '', duration: '' }],
    });
  };

  const removeExercise = (index) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Token for submit:', token);
      if (!token) {
        setError('Please log in to save a workout');
        navigate('/login');
        return;
      }
      const { id, name, category, exercises } = formData;
      const payload = { name, category, exercises };
      let newWorkout;
      if (id) {
        newWorkout = await updateWorkout(id, payload);
        setWorkouts(workouts.map((w) => (w._id === id ? newWorkout : w)));
      } else {
        newWorkout = await createWorkout(payload);
        setWorkouts([newWorkout, ...workouts]);
      }
      setFormData({
        id: null,
        name: '',
        category: 'strength',
        exercises: [{ name: '', sets: '', reps: '', duration: '' }],
      });
      setError(null);
    } catch (err) {
      console.error('Submit workout error:', err);
      setError(err.response?.data?.msg || 'Failed to save workout');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleEdit = (workout) => {
    setFormData({
      id: workout._id,
      name: workout.name,
      category: workout.category,
      exercises: workout.exercises.map((ex) => ({
        name: ex.name,
        sets: ex.sets || '',
        reps: ex.reps || '',
        duration: ex.duration || '',
      })),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token for deleteWorkout:', token);
      if (!token) {
        setError('Please log in to delete a workout');
        navigate('/login');
        return;
      }
      await deleteWorkout(id);
      setWorkouts(workouts.filter((workout) => workout._id !== id));
      setError(null);
    } catch (err) {
      console.error('Delete workout error:', err);
      setError(err.response?.data?.msg || 'Failed to delete workout');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  // Monthly workout distribution
  const getMonthlyData = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const categories = ['strength', 'cardio', 'yoga', 'other'];
    const data = months.map(() => categories.map(() => 0));

    workouts.forEach((workout) => {
      const date = new Date(workout.createdAt);
      if (date.getFullYear() === selectedYear) {
        const monthIndex = date.getMonth();
        const categoryIndex = categories.indexOf(workout.category);
        if (categoryIndex !== -1) {
          data[monthIndex][categoryIndex]++;
        }
      }
    });

    return {
      labels: months,
      datasets: categories.map((category, index) => ({
        label: category.charAt(0).toUpperCase() + category.slice(1),
        data: data.map((month) => month[index]),
        backgroundColor: [
          'rgba(76, 175, 80, 0.6)', // Strength
          'rgba(33, 150, 243, 0.6)', // Cardio
          'rgba(244, 67, 54, 0.6)', // Yoga
          'rgba(156, 39, 176, 0.6)', // Other
        ][index],
        borderColor: [
          '#4CAF50',
          '#2196F3',
          '#F44336',
          '#9C27B0',
        ][index],
        borderWidth: 1,
      })),
    };
  };

  const chartOptions = {
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Workouts' } },
      x: { title: { display: true, text: 'Month' } },
    },
    plugins: { legend: { display: true }, tooltip: { enabled: true } },
  };

  // Get available years for selection
  const availableYears = Array.from(
    new Set(workouts.map((w) => new Date(w.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  return (
    <>
      <Navbartwo />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex flex-col items-center pt-20">
        {loading && <p className="text-gray-300">Loading workouts...</p>}
        {error && <p className="text-red-400">{error}</p>}
        <header className="w-full text-center py-10 relative z-10">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl font-extrabold text-teal-400 mb-4">Manage Your Workouts</h1>
            <p className="text-lg text-gray-300">
              Create, edit, and track personalized workout plans to achieve your fitness goals.
            </p>
          </div>
          
        </header>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-3xl -top-10 -left-10 animate-pulse"></div>
          <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl top-40 right-10 animate-pulse"></div>
        </div>
        <section className="py-10 w-full max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-teal-400 mb-6">{formData.id ? 'Edit Workout Plan' : 'Create Workout Plan'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Workout Name (e.g., Leg Day)"
                className="p-2 border border-gray-700 rounded bg-gray-900 text-white"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="p-2 border border-gray-700 rounded bg-gray-900 text-white"
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="yoga">Yoga</option>
                <option value="other">Other</option>
              </select>
              {formData.exercises.map((exercise, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name={`exercise.name`}
                      value={exercise.name}
                      onChange={(e) => handleInputChange(e, index)}
                      placeholder="Exercise Name (e.g., Squats)"
                      className="p-2 border border-gray-700 rounded bg-gray-900 text-white flex-1"
                      required
                    />
                    {formData.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        Remove
                      </button>
                      



















                      
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name={`exercise.sets`}
                      value={exercise.sets}
                      onChange={(e) => handleInputChange(e, index)}
                      placeholder="Sets"
                      className="p-2 border border-gray-700 rounded bg-gray-900 text-white w-1/3"
                    />
                    <input
                      type="number"
                      name={`exercise.reps`}
                      value={exercise.reps}
                      onChange={(e) => handleInputChange(e, index)}
                      placeholder="Reps"
                      className="p-2 border border-gray-700 rounded bg-gray-900 text-white w-1/3"
                    />
                    <input
                      type="number"
                      name={`exercise.duration`}
                      value={exercise.duration}
                      onChange={(e) => handleInputChange(e, index)}
                      placeholder="Duration (min)"
                      className="p-2 border border-gray-700 rounded bg-gray-900 text-white w-1/3"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addExercise}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  Add Exercise
                </button>
                {formData.id && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        id: null,
                        name: '',
                        category: 'strength',
                        exercises: [{ name: '', sets: '', reps: '', duration: '' }],
                      })
                    }
                    className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
              >
                {formData.id ? 'Update Workout' : 'Save Workout'}
              </button>
            </form>
          </div>
        </section>
        <section className="py-10 w-full max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-2xl font-bold text-teal-400 mb-6">Monthly Workout Distribution</h2>
          <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-300">Select Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="p-2 border border-gray-700 rounded bg-gray-900 text-white"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
            <Bar data={getMonthlyData()} options={chartOptions} />
          </div>
        </section>
        <section className="py-10 w-full max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-2xl font-bold text-teal-400 mb-6">Your Workouts</h2>
          {workouts.length === 0 ? (
            <p className="text-gray-400">No workouts yet. Create one above!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workouts.map((workout) => (
                <div
                  key={workout._id}
                  className="relative bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl shadow-2xl hover:shadow-teal-500/50 transform transition-all duration-300 hover:scale-105 border border-gray-700"
                >
                  <h3 className="text-xl font-semibold text-gray-200">{workout.name}</h3>
                  <p className="text-gray-400 capitalize">Category: {workout.category}</p>
                  <p className="text-gray-400">Created: {new Date(workout.createdAt).toLocaleDateString()}</p>
                  <ul className="mt-2 text-gray-400">
                    {workout.exercises.map((exercise, index) => (
                      <li key={index}>
                        {exercise.name}: {exercise.sets || 'N/A'} sets, {exercise.reps || 'N/A'} reps,{' '}
                        {exercise.duration || 'N/A'} min
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(workout)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(workout._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      Delete
                    </button>
                    


                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
        
      </div>
    </>
  );
};

export default Workouts;