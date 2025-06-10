import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Check if admin is authenticated
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      console.log('🔐 Checking admin authentication...');

      const response = await axios.post(
        `${backendUrl}/auth/is-admin`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        console.log('✅ Admin authenticated:', response.data.user);
        setAdminData(response.data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        console.log('❌ Admin authentication failed');
        setAdminData(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      setAdminData(null);
      setIsAuthenticated(false);
      
      // If it's a 401/403, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
        window.location.href = `${frontendUrl}`;
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      console.log('🔐 Admin login attempt...');
      
      const response = await axios.post(
        `${backendUrl}/auth/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        const user = response.data.user;
        
        // Check if user is admin
        if (user.role !== 'admin') {
          toast.error('Access denied. Admin privileges required.');
          return { success: false, message: 'Access denied. Admin privileges required.' };
        }

        console.log('✅ Admin login successful:', user);
        setAdminData(user);
        setIsAuthenticated(true);
        
        toast.success('Login successful!');
        return { success: true, user };
      } else {
        toast.error(response.data.message || 'Login failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('🚪 Admin logout...');
      
      await axios.post(
        `${backendUrl}/auth/logout`,
        {},
        { withCredentials: true }
      );
      
      setAdminData(null);
      setIsAuthenticated(false);
      
      console.log('✅ Admin logout successful');
      
      // Clear ALL authentication data from storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Force redirect to frontend with a clean slate
      const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
      window.location.replace(`${frontendUrl}/`);
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if logout fails on backend, clear local state and redirect
      setAdminData(null);
      setIsAuthenticated(false);
      
      // Clear ALL authentication data
      localStorage.clear();
      sessionStorage.clear();
      
      const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
      window.location.replace(`${frontendUrl}/`);
    }
  };

  // Refresh admin data
  const refreshAdminData = async () => {
    return await checkAuth();
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    adminData,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    refreshAdminData,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Export the provider with the expected name
export const AdminContextProvider = AdminProvider;

export default AdminContext;