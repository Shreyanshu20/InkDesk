import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContentProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Add this line

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Check authentication on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true); // Set loading to true when checking
      try {
        const response = await axios.post(
          `${backendUrl}/auth/is-auth`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          console.log("✅ User authenticated via cookie:", response.data.user);
          setIsLoggedIn(true);
          setUserData(response.data.user);
        } else {
          console.log("❌ No valid authentication cookie");
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        console.log("❌ Authentication check failed:", error.response?.status);
        setIsLoggedIn(false);
        setUserData(null);
      } finally {
        setLoading(false); // Always set loading to false when done
      }
    };

    checkAuthStatus();
  }, [backendUrl]);

  // Logout function - only clear cookies
  const logout = async () => {
    try {
      await axios.post(
        `${backendUrl}/auth/logout/`,
        {},
        { withCredentials: true }
      );
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    } finally {
      // Clear state regardless of logout success
      setIsLoggedIn(false);
      setUserData(null);
      return true;
    }
  };

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    loading, // Add loading to the context value
    logout,
  };

  return (
    <AppContent.Provider value={value}>
      {children}
    </AppContent.Provider>
  );
};
