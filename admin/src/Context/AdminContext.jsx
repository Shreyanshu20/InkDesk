import { createContext, useState, useEffect, useContext } from "react";

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Always true to prevent redirect
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false); // Always false to prevent loading

  // Just grab data from localStorage without any verification
  useEffect(() => {
    const storedAdminData = localStorage.getItem("adminData");
    const storedUserData = localStorage.getItem("userData");
    
    if (storedAdminData) {
      try {
        const parsedData = JSON.parse(storedAdminData);
        setAdminData(parsedData);
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
      }
    } else if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        if (parsedData.role === 'admin') {
          setAdminData(parsedData);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
  }, []);

  const logout = () => {
    setIsLoggedIn(false);
    setAdminData(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
    window.location.href = `${frontendUrl}/login?type=seller`;
  };

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    adminData,
    setAdminData,
    loading,
    logout,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminContextProvider');
  }
  return context;
};