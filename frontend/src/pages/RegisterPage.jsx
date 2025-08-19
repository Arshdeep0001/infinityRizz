// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  // --- START MODIFICATION: Use mobileNumber instead of email ---
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  // --- END MODIFICATION ---
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // --- START MODIFICATION: Use sendOtp and verifyOtp functions from AuthContext ---
  const { sendOtp, verifyOtp, loading } = useAuth();
  // --- END MODIFICATION ---
  const navigate = useNavigate();

  // --- START MODIFICATION: Handle OTP submission and mobile number submission in one handler ---
  const handleMobileNumberSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    const result = await sendOtp(name, mobileNumber, password);

    if (result.success) {
      // If OTP is sent, show the OTP form
      setShowOtpForm(true);
      setErrorMessage('OTP sent to your mobile number. Please enter it below.');
    } else {
      setErrorMessage(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const result = await verifyOtp(mobileNumber, otp);

    if (result.success) {
      navigate('/shop');
    } else {
      setErrorMessage(result.error || 'OTP verification failed. Please try again.');
    }
  };
  // --- END MODIFICATION ---

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
          <h2 className="text-4xl font-extrabold text-center mb-8 text-white luxury-font">Register</h2>
          {errorMessage && (
            <div className={`text-white p-3 rounded-md mb-4 text-center ${errorMessage.includes('OTP') ? 'bg-green-700' : 'bg-red-800'}`}>
              {errorMessage}
            </div>
          )}
          {/* --- START MODIFICATION: Conditionally render forms --- */}
          {!showOtpForm ? (
            <form onSubmit={handleMobileNumberSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-3  hover:bg-transparent hover:border hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 luxury-font"
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Register'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6">
                <label htmlFor="otp" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-3  hover:bg-transparent hover:border hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 luxury-font"
                disabled={loading}
              >
                {loading ? 'Verifying OTP...' : 'Verify & Register'}
              </button>
            </form>
          )}
          {/* --- END MODIFICATION --- */}
          <div className="mt-6 text-center text-gray-400 luxury-font">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
