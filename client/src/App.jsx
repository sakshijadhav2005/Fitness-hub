import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Workouts from './Pages/Workouts.jsx';
import Progress from './Pages/Progress.jsx';
import Login from './Pages/Login.jsx';
import Signup from './Pages/Signup.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import WorkoutPlan from './Pages/WorkoutPlan.jsx';
import VoiceBot from './Pages/VoiceBot.jsx';
import Admin from './Pages/Admin.jsx';
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
     
      <Routes>
        <Route path="/"element={<Home />}
        />
        <Route  path="/workouts"element={<ProtectedRoute><Workouts /></ProtectedRoute>}
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
          <Route path="/workoutplan" element={<ProtectedRoute><WorkoutPlan /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/VoiceBot" element={<VoiceBot />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;