import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContentProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Initialize state from localStorage if available
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  const [loading, setLoading] = useState(true);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("isLoggedIn");
    }
  }, [isLoggedIn]);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  // Add storage event listener to detect when admin clears storage
  useEffect(() => {
    const handleStorageChange = (e) => {
      // If localStorage is completely cleared (like admin logout does)
      if (e.key === null || e.key === "isLoggedIn" || e.key === "userData") {
        console.log("🔄 Storage cleared, re-checking auth...");
        // Force clear frontend auth state
        setIsLoggedIn(false);
        setUserData(null);
        setLoading(false);
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);

    // Also check if storage was cleared manually (for same-tab clearing)
    const checkStorageCleared = () => {
      if (!localStorage.getItem("isLoggedIn") && !localStorage.getItem("userData") && isLoggedIn) {
        console.log("🔄 Storage manually cleared, updating auth state...");
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    // Check storage state periodically for same-tab changes
    const interval = setInterval(checkStorageCleared, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  // Check auth status when the app loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      // If no localStorage data exists, don't even try to authenticate
      if (!localStorage.getItem("isLoggedIn") && !localStorage.getItem("userData")) {
        console.log("🚫 No stored auth data, skipping auth check");
        setIsLoggedIn(false);
        setUserData(null);
        setLoading(false);
        return;
      }

      if (!userData) {
        setLoading(true);
      }

      try {
        const response = await axios.post(
          `${backendUrl}/auth/is-auth/`,
          {},
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setIsLoggedIn(true);
          setUserData(response.data.user);
        } else {
          // Clear state if auth check fails
          setIsLoggedIn(false);
          setUserData(null);
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userData");
        }
      } catch (error) {
        console.log("Authentication check failed or not authenticated");
        // Clear state on auth failure
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userData");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [backendUrl]);

  // Logout function with proper cleanup
  const logout = async () => {
    try {
      await axios.post(
        `${backendUrl}/auth/logout/`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggedIn(false);
      setUserData(null);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userData");
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
    logout,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};
