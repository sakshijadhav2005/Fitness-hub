
import React, { useState, useEffect } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import Eye icons for visibility toggle

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await login({ email, password });
      const token = response?.data?.token;
      const user = response?.data?.user;
       const isAdmin = response?.data?.user?.isAdmin; // Get isAdmin status from response
        console.log("isAdmin", isAdmin);
       

      if (token && user ) {
        if (isAdmin === false) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/workouts");
      }
    else{

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/admin");
    } }
      else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "❌ Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b1a2b] to-[#0e2a3a] p-8">
      <div className="w-full max-w-md p-8 bg-opacity-40 backdrop-blur-md bg-gray-900 rounded-3xl shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-blue-500/50 hover:scale-105">
        
        <h2 className="text-4xl font-extrabold text-center text-white mb-6 tracking-widest bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Login 🔐
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* ✅ Email Input */}
          <div className="relative group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform group-hover:scale-105 group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/50"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* ✅ Password Input with Show/Hide Button */}
          <div className="relative group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform group-hover:scale-105 group-hover:border-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/50"
                placeholder="Enter your password"
                required
              />
              {/* Eye Icon Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* ✅ Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* ✅ Animated Login Button */}
          <button
            type="submit"
            className={`w-full py-3 font-semibold rounded-xl focus:outline-none transition-all duration-300 transform hover:scale-110 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/50"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span>Logging In...</span>
              </span>
            ) : (
              "Login 🚀"
            )}
          </button>
        </form>

        {/* ✅ Signup & Forgot Password Links */}
        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
        

      </div>
    </div>
  );
};

export default Login;
