import { useEffect, useState } from "react";
import {
  fetchAllUsers,
  deleteUser,
  getWorkoutsByUser,
  deleteWorkoutByUser,
} from "../services/api";
import Navbar from "../Components/Navbar";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserWorkouts, setSelectedUserWorkouts] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [workoutLoading, setWorkoutLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetchAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleViewWorkouts = async (userId, userName) => {
    setWorkoutLoading(true);
    setSelectedUserWorkouts([]);
    setSelectedUserName(userName);
    try {
      const response = await getWorkoutsByUser(userId);
      const workouts = Array.isArray(response.data) ? response.data : [];
      setSelectedUserWorkouts(workouts);
    } catch (err) {
      alert("Failed to fetch workouts for user");
    } finally {
      setWorkoutLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId));
      setSelectedUserName("");
      setSelectedUserWorkouts([]);
    } catch (err) {
      alert("Failed to delete user");
    }
  };

 const handleDeleteWorkout = async (workoutId) => {
  if (!window.confirm("Are you sure you want to delete this workout?")) return;
  try {
    await deleteWorkoutByUser(workoutId);
    setSelectedUserWorkouts((prev) => prev.filter((w) => w._id !== workoutId));
  } catch (err) {
    console.error("Delete workout error:", err);
    alert("Failed to delete workout");
  }
};



  if (loading) return <p className="text-center mt-10 text-white">Loading users...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1a2b] to-[#0e2a3a] p-8 text-white">
        <h2 className="text-4xl font-bold text-center mb-10 tracking-widest bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 text-transparent bg-clip-text">
          Manage Users & Their Workouts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Users List */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700 space-y-5">
            <h3 className="text-2xl font-bold text-center text-green-400 mb-4">All Users</h3>
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:border-blue-400 hover:shadow-blue-400/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${user.isAdmin ? "bg-green-500" : "bg-red-500"}`}
                      title={user.isAdmin ? "Admin" : "User"}
                    ></div>
                    <h4 className="text-lg font-semibold">{user.name}</h4>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{user.email}</p>
                <div className="flex gap-3 mt-4">
                  <button
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-purple-600 text-white rounded-md text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={() => handleViewWorkouts(user._id, user.name)}
                  >
                    View workouts
                  </button>
                  <button
                    className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-pink-600 hover:to-red-700 text-white rounded-md text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected User's Workouts */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700 space-y-5">
            <h3 className="text-2xl font-bold text-center text-purple-400 mb-4">
              {selectedUserName ? `${selectedUserName}'s Workouts` : "Select a user to view workouts"}
            </h3>

            {workoutLoading ? (
              <p className="text-center text-white">Loading workouts...</p>
            ) : selectedUserWorkouts.length === 0 ? (
              <p className="text-center text-gray-400">No workouts available.</p>
            ) : (
              selectedUserWorkouts.map((workout) => (
                <div
                  key={workout._id}
                  className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300"
                >
                  <h4 className="text-green-300 text-lg font-semibold mb-1">
                    Workout Name : {workout.name}
                  </h4>
                  <p className="text-sm text-blue-300 mb-1 capitalize">
                    Category: {workout.category}
                  </p>
                  <p className="text-sm text-gray-400 mb-3">
                    Created At: {new Date(workout.createdAt).toLocaleString()}
                  </p>
                  <button
                    className="px-4 py-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-rose-600 hover:to-red-700 text-white rounded-md text-sm font-semibold shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    onClick={() => handleDeleteWorkout(workout._id)}
                  >
                    Delete workout
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;

