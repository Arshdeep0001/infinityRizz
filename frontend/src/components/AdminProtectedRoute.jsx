// src/components/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Show a loading state while authentication status is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl">
        Checking admin access...
      </div>
    );
  }

  // If the user is authenticated AND is an admin, render the child routes (Outlet)
  // Otherwise, redirect them to the login page (or an unauthorized page)
  if (isAuthenticated && user && user.isAdmin) {
    return <Outlet />;
  } else {
    // Redirect to login, and optionally pass the current path to redirect back after login
    return <Navigate to="/login" replace />;
  }
};

export default AdminProtectedRoute; // This line ensures it's a default export
