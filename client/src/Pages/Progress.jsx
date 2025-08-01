import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressChart from '../Components/ProgressChart';
import { getLogs, logWorkout, getWorkouts, deleteLog } from '../services/api';
import { toast } from 'react-toastify';
import Navbartwo from '../Components/Navbartwo';
const Progress = () => {
  const [logs, setLogs] = useState([]);
  const [originalLogs, setOriginalLogs] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [logFormData, setLogFormData] = useState({ workoutId: '', category: 'strength', notes: '' });
  const [filter, setFilter] = useState({ category: 'all', dateRange: 'all' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (retries = 3) => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view progress');
          toast.error('Please log in to view progress');
          navigate('/login');
          return;
        }
        const [logData, workoutData] = await Promise.all([getLogs(), getWorkouts()]);
        setLogs(logData);
        setOriginalLogs(logData);
        setWorkouts(workoutData);
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          toast.error('Session expired. Please log in again.');
          navigate('/login');
        } else if (retries > 0) {
          setTimeout(() => fetchData(retries - 1), 1000);
        } else {
          setError(err.response?.data?.msg || 'Failed to load progress');
          toast.error(err.response?.data?.msg || 'Failed to load progress');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const applyFilters = (category, dateRange) => {
    let filteredLogs = [...originalLogs];
    if (category !== 'all') {
      filteredLogs = filteredLogs.filter((log) => log.category.toLowerCase() === category);
    }
    if (dateRange !== 'all') {
      const now = new Date();
      const days = { '7': 7, '30': 30, '90': 90 };
      const cutoff = new Date(now.setDate(now.getDate() - days[dateRange]));
      filteredLogs = filteredLogs.filter((log) => new Date(log.createdAt) >= cutoff);
    }
    setLogs(filteredLogs);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilter = { ...filter, [name]: value };
    setFilter(newFilter);
    applyFilters(newFilter.category, newFilter.dateRange);
  };

  const resetFilters = () => {
    setFilter({ category: 'all', dateRange: 'all' });
    setLogs(originalLogs);
    toast.info('Filters reset.');
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to log a workout');
        navigate('/login');
        return;
      }
      const newLog = await logWorkout(logFormData);
      setLogs([newLog, ...logs]);
      setOriginalLogs([newLog, ...originalLogs]);
      setLogFormData({ workoutId: '', category: 'strength', notes: '' });
      toast.success('Workout logged successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to log workout');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this workout log?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to delete a log');
        navigate('/login');
        return;
      }
      await deleteLog(logId);
      setLogs(logs.filter((log) => log._id !== logId));
      setOriginalLogs(originalLogs.filter((log) => log._id !== logId));
      toast.success('Workout log deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to delete log');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleLogInputChange = (e) => {
    const { name, value } = e.target;
    setLogFormData({ ...logFormData, [name]: value });
  };

  const getMetrics = () => {
    const totalLogs = logs.length;
    const totalDuration = logs.reduce((sum, log) => {
      const workout = workouts.find((w) => w._id === log.workoutId);
      return sum + (workout ? workout.exercises.reduce((s, e) => s + (Number(e.duration) || 0), 0) : 0);
    }, 0);
    const weeks = Math.max(1, (new Date().getTime() - new Date(new Date().setMonth(new Date().getMonth() - 3)).getTime()) / (1000 * 60 * 60 * 24 * 7));
    const consistency = (totalLogs / weeks).toFixed(1);
    return { totalLogs, totalDuration, consistency };
  };

  const { totalLogs, totalDuration, consistency } = getMetrics();

  return (
    <>
    
    
  <Navbartwo/>
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex flex-col items-center pt-16">
      <h1 className="text-4xl font-extrabold text-teal-400 mb-6">Your Progress</h1>
      {loading && <p className="text-gray-300">Loading progress...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Quick Stats */}
      <section className="w-full max-w-4xl mx-auto px-6 py-6">
        <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-teal-400 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-300">{totalLogs}</p>
              <p className="text-gray-500">Total Workouts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-300">{totalDuration}</p>
              <p className="text-gray-500">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-300">{consistency}</p>
              <p className="text-gray-500">Workouts/Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* Log Workout */}
      <section className="w-full max-w-3xl mx-auto px-6 py-6">
        <div className="bg-gray-800/40 backdrop-blur-lg p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-teal-400">Log a Workout</h2>
          </div>
          <form onSubmit={handleLogSubmit} className="flex flex-col gap-4">
            <select
              name="workoutId"
              value={logFormData.workoutId}
              onChange={handleLogInputChange}
              className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-teal-400"
              required
            >
              <option value="">Select Workout</option>
              {workouts.map((workout) => (
                <option key={workout._id} value={workout._id}>{workout.name}</option>
              ))}
            </select>
            <select
              name="category"
              value={logFormData.category}
              onChange={handleLogInputChange}
              className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-teal-400"
            >
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="yoga">Yoga</option>
              <option value="other">Other</option>
            </select>
            <textarea
              name="notes"
              value={logFormData.notes}
              onChange={handleLogInputChange}
              placeholder="Notes (e.g., Felt great, increased weight)"
              className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-teal-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
            >
              Log Workout
            </button>
          </form>
        </div>
      </section>

      {/* Logs & Insights */}
      <section className="w-full max-w-4xl mx-auto px-6 py-6">
        <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-teal-400 mb-4">Filter Insights</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-teal-400"
            >
              <option value="all">All Categories</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="yoga">Yoga</option>
              <option value="other">Other</option>
            </select>
            <select
              name="dateRange"
              value={filter.dateRange}
              onChange={handleFilterChange}
              className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-teal-400"
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition duration-300"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <ProgressChart logs={logs} workouts={workouts} />
      </section>

      {/* Horizontal Rectangle Logs */}
      <section className="w-full max-w-4xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold text-teal-400 mb-4">Your Workout Logs</h2>
        {logs.length === 0 ? (
          <p className="text-gray-400">No logs yet. Log a workout above!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {logs.map((log) => (
              <div
                key={log._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-800/30 backdrop-blur-lg px-6 py-4 rounded-xl shadow-lg hover:shadow-teal-500/50 transition duration-300"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-200">
                    {workouts.find((w) => w._id === log.workoutId)?.name || 'Unknown Workout'}
                  </h3>
                  <p className="text-gray-400 capitalize">Category: {log.category}</p>
                  <p className="text-gray-400">Date: {new Date(log.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-400">Notes: {log.notes || 'N/A'}</p>
                </div>
                <button
                  onClick={() => handleDeleteLog(log._id)}
                  className="mt-4 sm:mt-0 sm:ml-4 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>  </>
  );
};

export default Progress;
