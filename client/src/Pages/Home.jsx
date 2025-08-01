
import { useNavigate } from 'react-router-dom';
import React from 'react';
import Navbar from '../Components/Navbar'; 


const Home = () => {
  
  const navigate = useNavigate();

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex flex-col items-center">
        {/* Header Section */}
        <header className="w-full text-center py-20 relative z-10">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500 animate-pulse">
              Welcome to Fitness Tracker
            </h1>
            <p className="text-xl text-gray-300 mt-6 leading-relaxed">
              <b>Log workouts, track calories, and achieve your fitness goals with ease.</b>
            </p>
            <div className="mt-10">
              <button
                className="px-12 py-4 bg-gradient-to-r from-teal-500 to-purple-500 text-white font-semibold rounded-full shadow-xl hover:shadow-teal-500/50 transform hover:scale-110 transition duration-500"
                onClick={goToSignup}
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* Glowing Background Design */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-3xl -top-10 -left-10 animate-pulse"></div>
          <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl top-40 right-10 animate-pulse"></div>
        </div>

        {/* Features Section */}
        <section className="py-20 w-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-7xl mx-auto px-8">
            {/* Feature Box 1: Workout Plans */}
            <div className="relative bg-gray-800/30 backdrop-blur-lg p-10 rounded-2xl shadow-2xl hover:shadow-teal-500/50 transform transition-all duration-300 hover:scale-105 border border-gray-700 group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-transparent opacity-0 group-hover:opacity-20 rounded-2xl transition-all duration-500"></div>
              <div className="flex items-center justify-center w-20 h-20 bg-teal-600 text-white rounded-full mb-6 mx-auto shadow-lg">
                <i className="fas fa-dumbbell text-3xl"></i>
              </div>
              <h2 className="text-3xl font-semibold text-gray-200 mb-4 group-hover:text-teal-400 transition duration-300">
                Workout Plans
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Create and follow personalized workout plans for strength, cardio, or yoga.
              </p>
              <div className="relative w-full bg-gray-700 rounded-full h-3 mb-4">
                <div className="bg-teal-500 h-3 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-sm text-teal-400">Progress: 80%</p>
            
            </div>

            {/* Feature Box 2: Calorie Tracking */}
            <div className="relative bg-gray-800/30 backdrop-blur-lg p-10 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform transition-all duration-300 hover:scale-105 border border-gray-700 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-0 group-hover:opacity-20 rounded-2xl transition-all duration-500"></div>
              <div className="flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-full mb-6 mx-auto shadow-lg">
                <i className="fas fa-utensils text-3xl"></i>
              </div>
              <h2 className="text-3xl font-semibold text-gray-200 mb-4 group-hover:text-blue-400 transition duration-300">
                Calorie Tracking
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Log meals and track calories with Nutritionix API integration.
              </p>
              <div className="relative w-full bg-gray-700 rounded-full h-3 mb-4">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-sm text-blue-400">Progress: 65%</p>
             
            </div>

            {/* Feature Box 3: Progress Charts */}
            <div className="relative bg-gray-800/30 backdrop-blur-lg p-10 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform transition-all duration-300 hover:scale-105 border border-gray-700 group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-transparent opacity-0 group-hover:opacity-20 rounded-2xl transition-all duration-500"></div>
              <div className="flex items-center justify-center w-20 h-20 bg-purple-600 text-white rounded-full mb-6 mx-auto shadow-lg">
                <i className="fas fa-chart-line text-3xl"></i>
              </div>
              <h2 className="text-3xl font-semibold text-gray-200 mb-4 group-hover:text-purple-400 transition duration-300">
                Progress Charts
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Visualize your fitness journey with interactive charts.
              </p>
              <div className="relative w-full bg-gray-700 rounded-full h-3 mb-4">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <p className="text-sm text-purple-400">Progress: 90%</p>
             
            </div>
          </div>
        </section>

        {/* Call-to-Action Section with Meal Input */}
       
         <div className="flex flex-col md:flex-row items-center bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-blue-400 transition-all duration-300 transform hover:scale-105 max-w-4xl w-full mb-12 neomorphism shadow-purple-300">
        
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-white">SAKSHI JADHAV 💕</h3>
          <p className="text-gray-300 text-sm mt-2">
            Passionate about web development, problem-solving, and creating meaningful applications to impact lives positively.
          </p>
        </div>
      </div>

        {/* Footer Section */}
        <footer className="w-full py-8 bg-gray-950 text-center border-t border-gray-800 relative z-10">
          <p className="text-sm text-gray-500 mb-4">
            © 2025 Fitness Tracker. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-6">
            
            <a href="https://www.linkedin.com/in/sakshi-jadhav-3b5408337/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white transition duration-300">
      LinkedIn
    </a>
    <a href="https://github.com/sakshijadhav2005" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300">
      GitHub
    </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;



