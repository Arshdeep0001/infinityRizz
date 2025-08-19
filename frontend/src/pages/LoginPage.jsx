// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  // --- START MODIFICATION: Use mobileNumber instead of email ---
  const [mobileNumber, setMobileNumber] = useState('');
  // --- END MODIFICATION ---
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // --- START MODIFICATION: Pass mobileNumber to the login function ---
    const result = await login(mobileNumber, password);
    // --- END MODIFICATION ---

    if (result.success) {
      navigate('/shop');
    } else {
      setErrorMessage(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-black text-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/auth.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-70 z-10"></div>

      <main className="flex-grow flex items-center justify-center py-12 px-4 relative z-20">
        <div className="bg-white p-8  shadow-xl w-full max-w-md border border-gray-700 bg-opacity-10">
          <h2 className="text-4xl font-extrabold text-center mb-8 text-white luxury-font">Login</h2>
          {errorMessage && (
            <div className="bg-red-800 text-white p-3 rounded-md mb-4 text-center">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="mobileNumber" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* --- START MODIFICATION: Add Forgot Password link --- */}
            <div className="flex justify-end mb-6">
              <Link to="/forgot-password" className="text-blue-400 hover:underline text-sm luxury-font">
                Forgot Password?
              </Link>
            </div>
            {/* --- END MODIFICATION --- */}
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3  hover:bg-transparent hover:border hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 luxury-font"
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </form>
          <div className="mt-6 text-center text-gray-400 luxury-font">
            New Customer?{' '}
            <Link to="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
