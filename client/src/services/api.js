
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // Remove header if no token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token'); // Clear invalid token
    }
    return Promise.reject(error);
  }
);

export const createWorkout = (data) => api.post('/workouts', data).then((res) => res.data);
export const getWorkouts = () => api.get('/workouts').then((res) => res.data);
export const deleteWorkout = (id) => api.delete(`/workouts/${id}`).then((res) => res.data);
export const getNutritionData = (query) => api.post('/nutrition', { query }).then((res) => res.data);
// export const getUserPreferences = () => api.get('/user/preferences').then((res) => res.data);
// export const generateWorkoutPlan = (data) => api.post('/logs/generateplan', data).then((res) => res.data);
 export const signup = (userData) => api.post("/auth/signup", userData);
 export const updateWorkout = (id, data) => api.patch(`/workouts/${id}`, data).then((res) => res.data);

export const login = async (userData) => {
  try {
    const res = await api.post("/auth/login", userData);
    return res;
  } catch (error) {
    console.error("Login API error:", error.response?.data || error.message);
    throw error;
  }
};
export const askFitnessQuestion = (data) => api.post('/voicebot/answer', data).then((res) => res.data);

export const generateWorkoutPlan = (data) => api.post('/generateWorkoutPlan', data).then((res) => res.data);

export const logWorkout = (data) => api.post('/logs', data).then((res) => res.data);
export const getLogs = () => api.get('/logs').then((res) => res.data);
export const deleteLog = (id) => api.delete(`/logs/${id}`).then((res) => res.data);


// Admin-specific functions
export const fetchAllUsers = async () => {
  return await api.get("auth/getallusers"); // ✅ Correct route
};

export const deleteUser = async (userId) => {
  try {
    return await api.delete(`/auth/deleteuser/${userId}`);
  } catch (error) {
    throw error;
  }
};
export const getWorkoutsByUser = (userId) => {
  return api.get(`/workouts/user/${userId}`);
};
export const deleteWorkoutByUser = async ( workoutId) => {
  return await api.delete(`/workouts/user/${workoutId}`);
};


export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Reset Password API error:", error.response?.data || error.message);
    throw error;
  }
};





export default api;