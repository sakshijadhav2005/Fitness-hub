
import { useNavigate } from 'react-router-dom';
import React from 'react';

const Navbartwo = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
      localStorage.removeItem("user"); 
    navigate('/');
  };

  return (
     <>
    <nav className="w-full bg-gray-950 p-4 fixed top-0 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teal-400">Fitness Tracker</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-white text-lg font-medium hover:text-blue-400 hover:underline transition duration-300"
          >
            Home
          </button>
          
          <button
            onClick={() => navigate('/progress')}
            className="text-white text-lg font-medium hover:text-pink-400 hover:underline transition duration-300"
          >
            Progress
          </button>
           <button
            onClick={() => navigate('/workoutplan')}
            className="text-white text-lg font-medium hover:text-green-400 hover:underline transition duration-300"
          >
            Workout Plans
          </button>
          <button
                onClick={() => navigate('/VoiceBot')}
            className="text-white text-lg font-medium hover:text-pink-400 hover:underline transition duration-300"
              >
                Voice Bot
              </button>
          {token ? (
            <button
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transform transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
          
            
            
          ) : (
            <>
             
            </>
          )}
        </div>
      </div>
    </nav></>
  );
};

export default Navbartwo;