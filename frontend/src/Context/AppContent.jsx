import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContentProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Remove localStorage initialization - rely only on server auth check
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status when the app loads - ONLY rely on cookies
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        console.log("🔐 Checking authentication via cookies...");

        const response = await axios.post(
          `${backendUrl}/auth/is-auth/`,
          {},
          {
            withCredentials: true, // This sends the cookie
          }
        );

        if (response.data.success) {
          console.log("✅ User authenticated via cookie");
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
        setLoading(false);
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
    loading,
    logout,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};
