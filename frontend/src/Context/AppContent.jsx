import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContentProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${backendUrl}/auth/is-auth`,
          {},
          { withCredentials: true }
        );
        if (response.data.success) {
          setIsLoggedIn(true);
          setUserData(response.data.user);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, [backendUrl]);

  const logout = async () => {
    try {
      await axios.post(
        `${backendUrl}/auth/logout/`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
    } finally {
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
