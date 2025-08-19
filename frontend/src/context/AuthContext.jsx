// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
// --- START MODIFICATION: Update API functions for password reset ---
import { loginUser, sendOtpForRegistration, verifyOtpForRegistration, forgotPassword, resetPassword } from '../utils/api';
// --- END MODIFICATION ---

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } catch (error) {
      console.error("Failed to parse user info from localStorage:", error);
      localStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (mobileNumber, password) => {
    try {
      setLoading(true);
      const { data } = await loginUser({ mobileNumber, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      return { success: false, error: errorMessage };
    }
  };

  const sendOtp = async (name, mobileNumber, password) => {
    try {
      setLoading(true);
      const response = await sendOtpForRegistration({ name, mobileNumber, password });
      setLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      return { success: false, error: errorMessage };
    }
  };

  const verifyOtp = async (mobileNumber, otp) => {
    try {
      setLoading(true);
      const { data } = await verifyOtpForRegistration({ mobileNumber, otp });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      return { success: false, error: errorMessage };
    }
  };

  // --- START MODIFICATION: Add password reset functions ---
  const forgotPasswordRequest = async (mobileNumber) => {
    try {
      setLoading(true);
      const response = await forgotPassword({ mobileNumber });
      setLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      return { success: false, error: errorMessage };
    }
  };

  const resetPasswordConfirm = async (mobileNumber, otp, newPassword) => {
    try {
      setLoading(true);
      const response = await resetPassword({ mobileNumber, otp, newPassword });
      setLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      return { success: false, error: errorMessage };
    }
  };
  // --- END MODIFICATION ---

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const value = {
    user,
    loading,
    login,
    sendOtp,
    verifyOtp,
    // --- START MODIFICATION: Add password reset functions to context value ---
    forgotPasswordRequest,
    resetPasswordConfirm,
    // --- END MODIFICATION ---
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
