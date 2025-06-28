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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReadOnlyUser, setIsReadOnlyUser] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const checkAuth = async () => {
    try {
      setIsLoading(true);

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

      if (response.data.success) {
        const user = response.data.user;
        
        if (!['admin', 'user'].includes(user.role)) {
          setAdminData(null);
          setIsAuthenticated(false);
          return false;
        }

        setAdminData(user);
        setIsAuthenticated(true);
        setIsReadOnlyUser(user.role === 'user');
        
        return true;
      } else {
        setAdminData(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      setAdminData(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${backendUrl}/auth/login`,
        { 
          email, 
          password
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
        
        if (!['admin', 'user'].includes(user.role)) {
          toast.error('Access denied. Admin panel access requires admin or user role.');
          return { success: false, message: 'Access denied' };
        }

        setAdminData(user);
        setIsAuthenticated(true);
        setIsReadOnlyUser(user.role === 'user');
        
        return { success: true };
      } else {
        toast.error(response.data.message || 'Login failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${backendUrl}/auth/logout`,
        {},
        { withCredentials: true }
      );
      
      setAdminData(null);
      setIsAuthenticated(false);
      
      window.location.replace('/login');
      
    } catch (error) {
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

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        user: adminData,
        adminData,
        isAuthenticated,
        isLoading,
        isReadOnlyUser,
        login,
        logout,
        checkAuth,
        refreshAdminData: checkAuth,
        canPerformAction,
        isReadOnly,
        showPermissionDenied,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const AdminContextProvider = AdminProvider;

export default AdminContext;