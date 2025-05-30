import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../Context/AdminContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading, adminData } = useAdmin();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in and is an admin
  if (!isLoggedIn || !adminData || adminData.role !== 'admin') {
    console.log('🚫 Access denied. Redirecting to login.');
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
    window.location.href = `${frontendUrl}/login?type=seller&message=unauthorized`;
    return null;
  }

  return children;
};

export default ProtectedRoute;