import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  
  // ADD DEBUG
  console.log('🐛 useAdmin hook called, returning:', context);
  
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReadOnlyUser, setIsReadOnlyUser] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Check if admin is authenticated - ONLY via cookies
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      console.log('🔐 Checking admin panel authentication...');

      const response = await axios.post(
        `${backendUrl}/auth/is-auth`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('🔍 Full auth response:', response.data);

      if (response.data.success) {
        const user = response.data.user;
        
        console.log('🔍 User data from backend:', user);
        console.log('🔍 User role from backend:', user.role);
        
        // Check if user can access admin panel
        if (!['admin', 'user'].includes(user.role)) {
          console.log('❌ User role not allowed for admin panel:', user.role);
          setAdminData(null);
          setIsAuthenticated(false);
          return false;
        }

        console.log('✅ Setting admin data:', user);
        setAdminData(user); // This should set the user data
        setIsAuthenticated(true);
        setIsReadOnlyUser(user.role === 'user');
        
        // ADD VERIFICATION LOG
        console.log('✅ AdminData set to:', user);
        console.log('✅ Role should be:', user.role);
        
        return true;
      } else {
        console.log('❌ Auth response not successful');
        setAdminData(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      setAdminData(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function - ONLY set cookies, no localStorage
  const login = async (email, password) => { // Remove role parameter completely
    try {
      console.log('🔐 Admin panel login attempt');
      
      const response = await axios.post(
        `${backendUrl}/auth/login`,
        { 
          email, 
          password
          // Don't send role at all - let backend handle it based on user's actual role
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
        
        // FIXED: Allow both admin and user roles for admin panel
        if (!['admin', 'user'].includes(user.role)) {
          toast.error('Access denied. Admin panel access requires admin or user role.');
          return { success: false, message: 'Access denied' };
        }

        console.log('✅ Admin panel login successful:', user);
        setAdminData(user);
        setIsAuthenticated(true);
        setIsReadOnlyUser(user.role === 'user'); // Set read-only flag for users only
        
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
      
      // Redirect to login page
      window.location.replace('/login');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if logout fails on backend, clear local state and redirect
      setAdminData(null);
      setIsAuthenticated(false);
      
      window.location.replace('/login');
    }
  };

  const canPerformAction = () => {
    return adminData?.role === 'admin';
  };

  const isReadOnly = () => {
    return adminData?.role === 'user';
  };

  const showPermissionDenied = () => {
    toast.error('Only administrators can make changes', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // ADD DEBUG EFFECT
  useEffect(() => {
    console.log('🐛 AdminContext State Update:');
    console.log('  - adminData:', adminData);
    console.log('  - isAuthenticated:', isAuthenticated);
    console.log('  - isReadOnlyUser:', isReadOnlyUser);
    console.log('  - User role:', adminData?.role);
  }, [adminData, isAuthenticated, isReadOnlyUser]);

  const value = {
    adminData,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    refreshAdminData: checkAuth,
    isReadOnlyUser,
    canPerformAction,
    isReadOnly,
    showPermissionDenied,
  };

  // Fix AdminContext.jsx - Update the context provider value
  return (
    <AdminContext.Provider
      value={{
        user: adminData, // ✅ This should be adminData
        adminData,
        isAuthenticated,
        isLoading,
        isReadOnlyUser, // ✅ Make sure this is included
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// Export the provider with the expected name
export const AdminContextProvider = AdminProvider;

export default AdminContext;