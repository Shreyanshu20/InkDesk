import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContentProvider = ({ children }) => {
  const backendUrl = "http://localhost:5000"; // Updated to match your backend
  
  // Initialize state from localStorage if available
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : null;
  });
  
  const [loading, setLoading] = useState(true);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('isLoggedIn');
    }
  }, [isLoggedIn]);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  }, [userData]);

  // Check auth status when the app loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!userData) {
        setLoading(true);
      }
      
      try {
        const response = await axios.post(`${backendUrl}/auth/is-auth/`, {}, {
          withCredentials: true
        });
        
        if (response.data.success) {
          setIsLoggedIn(true);
          setUserData(response.data.user);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        console.log("Authentication check failed or not authenticated");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [backendUrl]);
  
  // Logout function with proper cleanup
  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/auth/logout/`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggedIn(false);
      setUserData(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      return true;
    }
  };

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    loading,
    logout
  };

  return (
    <AppContent.Provider value={value}>{children}</AppContent.Provider>
  );
};
