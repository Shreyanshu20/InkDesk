import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; // ADD THIS LINE
  
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Always true to prevent redirect
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false); // Always false to prevent loading

  // Check auth status when the app loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      // First check if we have stored admin data
      const storedAdminData = localStorage.getItem("adminData");
      const token = localStorage.getItem("adminToken") || localStorage.getItem("userToken");
      
      if (!token) {
        console.log('❌ No admin token found');
        setLoading(false);
        return;
      }

      // If we have stored admin data, use it temporarily
      if (storedAdminData) {
        try {
          const parsedData = JSON.parse(storedAdminData);
          if (parsedData.role === 'admin') {
            setAdminData(parsedData);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Error parsing stored admin data:', error);
        }
      }

      try {
        console.log('🔐 Verifying admin authentication...');
        console.log('🌐 Backend URL:', backendUrl);
        
        // Use GET method instead of POST and remove trailing slash
        const response = await axios.get(
          `${backendUrl}/auth/is-auth`, // Now backendUrl is defined
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true,
          }
        );

        if (response.data.success && response.data.user.role === 'admin') {
          console.log('✅ Admin authenticated:', response.data.user.email);
          setIsLoggedIn(true);
          setAdminData(response.data.user);
          
          // Update stored data
          localStorage.setItem('adminData', JSON.stringify(response.data.user));
          localStorage.setItem('adminToken', token);
          
          // Update axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else if (response.data.success && response.data.user.role !== 'admin') {
          console.log('❌ User is not admin, role:', response.data.user.role);
          logout();
        } else {
          console.log('❌ Admin auth failed');
          logout();
        }
      } catch (error) {
        console.error("❌ Admin authentication check failed:", error);
        
        // If we had stored data but verification failed, still show error
        if (storedAdminData) {
          console.log("Session may have expired, but continuing with stored data");
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [backendUrl]); // Add backendUrl to dependency array

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
    backendUrl, // Add this to the context value
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