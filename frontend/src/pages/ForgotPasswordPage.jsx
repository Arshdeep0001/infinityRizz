// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { forgotPasswordRequest, resetPasswordConfirm, loading } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const result = await forgotPasswordRequest(mobileNumber);

    if (result.success) {
      setSuccessMessage('OTP sent to your mobile number. Please check your messages.');
      setStep(2);
    } else {
      setErrorMessage(result.error || 'Failed to send OTP. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    const result = await resetPasswordConfirm(mobileNumber, otp, newPassword);

    if (result.success) {
      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setErrorMessage(result.error || 'Failed to reset password. Invalid OTP or mobile number.');
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
        <div className="bg-white p-8 shadow-xl w-full max-w-md border border-gray-700 bg-opacity-10">
          <h2 className="text-4xl font-extrabold text-center mb-8 text-white luxury-font">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h2>
          {successMessage && (
            <div className="bg-green-700 text-white p-3 rounded-md mb-4 text-center">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-800 text-white p-3 rounded-md mb-4 text-center">
              {errorMessage}
            </div>
          )}
          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
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
              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-3 hover:bg-transparent hover:border hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 luxury-font"
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
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
              <div className="mb-6">
                <label htmlFor="newPassword" className="block text-gray-300 text-lg font-semibold mb-2 luxury-font">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 luxury-font"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-3 hover:bg-transparent hover:border hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 luxury-font"
                disabled={loading}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}
          <div className="mt-6 text-center text-gray-400 luxury-font">
            <Link to="/login" className="text-blue-400 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
