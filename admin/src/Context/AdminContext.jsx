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

  // Check if admin is authenticated - ONLY via cookies
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      console.log('🔐 Checking admin authentication via cookies...');

      const response = await axios.post(
        `${backendUrl}/auth/is-admin`,
        {},
        {
          withCredentials: true, // This uses cookies ONLY
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        console.log('✅ Admin authenticated via cookie:', response.data.user);
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
      
      // Only redirect on 401/403, not on network errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('🔄 Redirecting to frontend login...');
        const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
        window.location.href = `${frontendUrl}/login?type=admin&redirect=admin`;
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function - ONLY set cookies, no localStorage
  const login = async (email, password) => {
    try {
      console.log('🔐 Admin login attempt...');
      
      const response = await axios.post(
        `${backendUrl}/auth/login`,
        { 
          email, 
          password,
          role: 'admin' // Explicitly set role for admin login
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        const user = response.data.user;
        
        if (user.role !== 'admin') {
          toast.error('Access denied. Admin privileges required.');
          return { success: false, message: 'Access denied' };
        }

        console.log('✅ Admin login successful:', user);
        setAdminData(user);
        setIsAuthenticated(true);
        
        toast.success('Login successful!');
        return { success: true };
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

  // Logout function - ONLY clear cookies
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
      
      console.log('✅ Admin logout successful - cookie cleared by server');
      
      // Force redirect to frontend
      const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
      window.location.replace(`${frontendUrl}/`);
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if logout fails on backend, clear local state and redirect
      setAdminData(null);
      setIsAuthenticated(false);
      
      const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
      window.location.replace(`${frontendUrl}/`);
    }
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
    refreshAdminData: checkAuth,
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