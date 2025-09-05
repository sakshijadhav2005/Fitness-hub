
import React, { useState } from "react";
import { signup } from "../services/api"; // ✅ Import API function
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await signup({ name, email, password }); // ✅ Call API
       localStorage.setItem("token", data.token); // ✅ Save JWT token
      navigate("/login");
      alert(data.message); // ✅ Redirect to Profile page
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b1a2b] to-[#0e2a3a] p-8">
      <div className="w-full max-w-md p-8 bg-opacity-40 backdrop-blur-md bg-gray-900 rounded-3xl shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-blue-500/50 hover:scale-105">
        
        {/* ✅ Animated Title */}
        <h2 className="text-4xl font-extrabold text-center text-white mb-6 tracking-widest bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
          Sign Up ✨
        </h2>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* ✅ Name Input */}
          <div className="relative group">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              placeholder="Enter your name"
            />
          </div>

          {/* ✅ Email Input */}
          <div className="relative group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>

          {/* ✅ Password Input with Toggle */}
          <div className="relative group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* ✅ Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* ✅ Animated Signup Button */}
          <button
            type="submit"
            className={`w-full py-3 font-semibold rounded-xl focus:outline-none transition-all duration-300 transform hover:scale-110 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white shadow-lg hover:shadow-green-500/50"
            }`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up 🚀"}
          </button>
        </form>

        {/* ✅ Login Link */}
        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
